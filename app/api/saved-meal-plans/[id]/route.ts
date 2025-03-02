import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { userId } = await auth();

    // Check if user is authenticated
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

    // Fetch the meal plan
    const mealPlan = await prisma.savedMealPlan.findUnique({
      where: {
        id,
      },
    });

    // Check if meal plan exists
    if (!mealPlan) {
      return NextResponse.json(
        { error: "Meal plan not found" },
        { status: 404 }
      );
    }

    // Check if user owns the meal plan
    if (mealPlan.userId !== userProfile.id) {
      return NextResponse.json(
        { error: "Unauthorized to access this meal plan" },
        { status: 403 }
      );
    }

    return NextResponse.json(mealPlan);
  } catch (error) {
    console.error("Error fetching meal plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch meal plan" },
      { status: 500 }
    );
  }
}
