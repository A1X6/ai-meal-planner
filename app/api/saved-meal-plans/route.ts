import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";

// Helper to get current user ID
async function getCurrentUserId() {
  const { userId } = await auth();
  return userId;
}

// GET endpoint to retrieve saved meal plans for a user
export async function GET() {
  try {
    // Get the current user ID
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user profile
    const userProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Fetch all saved meal plans for the user
    const savedMealPlans = await prisma.savedMealPlan.findMany({
      where: {
        userId: userProfile.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(savedMealPlans);
  } catch (error) {
    console.error("Error fetching saved meal plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved meal plans" },
      { status: 500 }
    );
  }
}

// POST endpoint to save a meal plan
export async function POST(req: NextRequest) {
  try {
    // Get the current user ID
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user profile
    const userProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const { name, mealPlanData } = body;

    // Validate the request body
    if (!name || !mealPlanData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new saved meal plan
    const savedMealPlan = await prisma.savedMealPlan.create({
      data: {
        userId: userProfile.id,
        name,
        mealPlanData,
      },
    });

    return NextResponse.json(savedMealPlan);
  } catch (error) {
    console.error("Error saving meal plan:", error);
    return NextResponse.json(
      { error: "Failed to save meal plan" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Get the current user ID
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user profile
    const userProfile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Get the meal plan ID from the query parameters
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing meal plan ID" },
        { status: 400 }
      );
    }

    // Check if the meal plan exists and belongs to the user
    const mealPlan = await prisma.savedMealPlan.findUnique({
      where: {
        id,
      },
    });

    if (!mealPlan) {
      return NextResponse.json(
        { error: "Meal plan not found" },
        { status: 404 }
      );
    }

    if (mealPlan.userId !== userProfile.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this meal plan" },
        { status: 403 }
      );
    }

    // Delete the meal plan
    await prisma.savedMealPlan.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: "Meal plan deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting meal plan:", error);
    return NextResponse.json(
      { error: "Failed to delete meal plan" },
      { status: 500 }
    );
  }
}
