"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { HiArrowLeft } from "react-icons/hi";
import DaySelector from "../../components/meal-plan/DaySelector";
import MealCard from "../../components/meal-plan/MealCard";
import NutritionSummary from "../../components/meal-plan/NutritionSummary";
import { SavedMealPlan } from "../../components/meal-plan/types";
import { calculateDailyTotals } from "../../components/meal-plan/utils";
import { formatDate } from "../../lib/utils";

// Function to fetch a saved meal plan
const fetchSavedMealPlan = async (id: string): Promise<SavedMealPlan> => {
  const response = await fetch(`/api/saved-meal-plans/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch meal plan");
  }
  return response.json();
};

export default function MealPlanDetailsPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  // Unwrap params using React.use() if it's a Promise
  const unwrappedParams =
    params instanceof Promise ? React.use(params) : params;
  const { id } = unwrappedParams;
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const {
    data: mealPlan,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["savedMealPlan", id],
    queryFn: () => fetchSavedMealPlan(id),
  });

  // Get selected day and calculate totals (if we have data)
  const selectedDay = useMemo(() => {
    if (mealPlan && mealPlan.mealPlanData && mealPlan.mealPlanData.length > 0) {
      return mealPlan.mealPlanData[activeDayIndex];
    }
    return null;
  }, [mealPlan, activeDayIndex]);

  const dailyTotals = useMemo(() => {
    if (selectedDay && selectedDay.meals) {
      return calculateDailyTotals(selectedDay.meals);
    }
    return null;
  }, [selectedDay]);

  // Function to handle day change
  const handleDayChange = (newIndex: number) => {
    console.log(`Changing day to index: ${newIndex}`);
    setActiveDayIndex(newIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <SignedIn>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col gap-8">
            {/* Back link and header */}
            <div className="flex flex-col gap-2">
              <Link
                href="/saved-meal-plans"
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 w-fit"
              >
                <HiArrowLeft className="mr-1" />
                <span>Back to Saved Meal Plans</span>
              </Link>

              {mealPlan && (
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {mealPlan.name}
                  </h1>
                  <p className="text-gray-400">
                    Created {formatDate(mealPlan.createdAt)}
                  </p>
                </div>
              )}
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-200">
                  Loading meal plan...
                </h3>
              </div>
            )}

            {/* Error state */}
            {isError && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-300">
                <p>Error loading meal plan: {(error as Error).message}</p>
                <Link
                  href="/saved-meal-plans"
                  className="inline-block mt-4 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 rounded-lg transition-colors duration-200"
                >
                  Return to Saved Meal Plans
                </Link>
              </div>
            )}

            {/* Meal plan content - only show when we have data */}
            {mealPlan &&
              mealPlan.mealPlanData &&
              mealPlan.mealPlanData.length > 0 && (
                <>
                  {/* Day selector */}
                  <div className="mb-6 lg:mb-8">
                    <DaySelector
                      days={mealPlan.mealPlanData}
                      activeIndex={activeDayIndex}
                      onDayChange={handleDayChange}
                    />
                  </div>

                  {/* Meals for selected day */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
                    {selectedDay?.meals.map((meal, index) => (
                      <MealCard key={index} meal={meal} />
                    ))}
                  </div>

                  {/* Daily summary */}
                  <div className="mb-6 lg:mb-8">
                    <NutritionSummary dailyTotals={dailyTotals!} />
                  </div>
                </>
              )}
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <div className="bg-gray-800/50 rounded-lg p-8 max-w-md">
            <h3 className="text-xl font-semibold text-gray-200 mb-4">
              Sign in to view meal plans
            </h3>
            <p className="text-gray-400 mb-6">
              Please sign in to access your saved meal plans.
            </p>
            <Link
              href="/sign-in"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
