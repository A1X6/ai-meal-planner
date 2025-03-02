import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: NextRequest) {
  try {
    // Get authentication info
    const { userId } = await auth();

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile
    const userProfile = await prisma.profile.findUnique({
      where: {
        userId,
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    const isSubscribed = userProfile.subscriptionActive;

    // Check if free trial user has reached limit
    const FREE_TRIAL_LIMIT = 5;
    if (!isSubscribed && userProfile.usage >= FREE_TRIAL_LIMIT) {
      return NextResponse.json(
        {
          error:
            "Free trial limit reached. Please subscribe to continue generating meal plans.",
          limitReached: true,
        },
        { status: 403 }
      );
    }

    const { dietType, calorieTarget, allergies, excludedIngredients, days } =
      await req.json();

    const prompt = `
    You are a professional nutritionist. Create a ${days}-day meal plan for an individual following a ${dietType} diet aiming for ${calorieTarget} calories per day.
    
    Allergies or restrictions: ${
      allergies.length > 0 ? allergies.join(", ") : "none"
    } and ${
      excludedIngredients.length > 0 ? excludedIngredients.join(", ") : "none"
    }.

    For each day, provide:
      - Breakfast
      - Lunch
      - Dinner
    
    Use simple ingredients and provide brief instructions. Include approximate calorie counts for each meal.
    
    Structure the response as a JSON object where each day is a key, and each meal (breakfast, lunch, dinner) is a sub-key with the ingredients and calories. Example:
    
    {
      "Monday": {
        "Breakfast": { "ingredients": "Oatmeal with fruits", "calories": 350 },
        "Lunch": { "ingredients": "Grilled chicken salad", "calories": 500 },
        "Dinner": { "ingredients": "Steamed vegetables with quinoa", "calories": 600 }
      },
      "Tuesday": {
        "Breakfast": { "ingredients": "Smoothie bowl", "calories": 300 },
        "Lunch": { "ingredients": "Turkey sandwich", "calories": 450 },
        "Dinner": { "ingredients": "Baked salmon with asparagus", "calories": 700 }
      }
      // ...and so on for each day
    }

    Return just the JSON with no extra text, comments, or backticks.
  `;

    const response = await openai.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const aiContent = response.choices[0].message.content?.trim() as string;
    let parsedContent: {
      [day: string]: {
        [meal: string]: { ingredients: string; calories: number };
      };
    };

    try {
      parsedContent = JSON.parse(aiContent);
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return NextResponse.json(
        { error: "Invalid JSON response from AI. Please try again." },
        { status: 500 }
      );
    }

    if (typeof parsedContent !== "object" || parsedContent === null) {
      return NextResponse.json(
        { error: "Invalid JSON response from AI. Please try again." },
        { status: 500 }
      );
    }

    // Successful response - increment usage count
    await prisma.profile.update({
      where: {
        userId,
      },
      data: {
        usage: userProfile.usage + 1,
      },
    });

    // Return the meal plan with usage info
    return NextResponse.json({
      mealPlan: parsedContent,
      usage: {
        count: userProfile.usage + 1,
        limit: isSubscribed ? null : FREE_TRIAL_LIMIT,
        isSubscribed,
      },
    });
  } catch (error) {
    console.error("Error generating meal plan:", error);
    return NextResponse.json(
      { error: "Failed to generate meal plan" },
      { status: 500 }
    );
  }
}
