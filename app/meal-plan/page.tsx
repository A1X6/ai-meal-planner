"use client";
import React, { useState, useEffect, useMemo } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { HiOutlineMenu, HiOutlineChevronRight } from "react-icons/hi";
import Link from "next/link";

// Import components
import MealPlanHeader from "../components/meal-plan/MealPlanHeader";
import DaySelector from "../components/meal-plan/DaySelector";
import MealCard from "../components/meal-plan/MealCard";
import NutritionSummary from "../components/meal-plan/NutritionSummary";
import ActionButtons from "../components/meal-plan/ActionButtons";
import PreferencesSidebar from "../components/meal-plan/PreferencesSidebar";
import SignedOutContent from "../components/meal-plan/SignedOutContent";

// Import types, data, and utilities
import {
  Preferences,
  MealPlanResponse,
  DayPlan,
  Meal,
} from "../components/meal-plan/types";
import { calculateDailyTotals } from "../components/meal-plan/utils";
import { useMutation } from "@tanstack/react-query";

async function generateMealPlan(preferences: Preferences) {
  const response = await fetch("/api/generate-meal-plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...preferences, days: 7 }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Check if this is a limit reached error
    if (data.limitReached) {
      // Instead of throwing an error, return a special object
      return { limitReached: true };
    }
    throw new Error("Failed to generate meal plan");
  }

  return data;
}

// Helper function to transform API response to the format expected by components
function transformMealPlanData(apiResponse: MealPlanResponse): DayPlan[] {
  try {
    if (!apiResponse?.mealPlan) {
      return []; // Return empty array if no meal plan
    }

    const transformedData: DayPlan[] = [];

    // Get all days from the response
    const days = Object.keys(apiResponse.mealPlan);

    days.forEach((day) => {
      const dayMeals = apiResponse.mealPlan![day];
      const mealTypes = Object.keys(dayMeals);

      const meals: Meal[] = mealTypes.map((mealType) => {
        const mealData = dayMeals[mealType];

        // Create a meal object with the available data and some placeholders
        return {
          type: mealType,
          name: mealType, // Use meal type as name since we don't have a specific name
          calories: mealData?.calories || 0, // Add fallback if calories is missing
          description: mealData?.ingredients || "",
        };
      });

      transformedData.push({
        day: day,
        meals: meals,
      });
    });

    return transformedData;
  } catch (error) {
    console.error("Error transforming meal plan data:", error);
    return []; // Return empty array on error
  }
}

const MealPlanPage = () => {
  const [mealPlan, setMealPlan] = useState<MealPlanResponse | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({
    dietType: "balanced",
    calorieTarget: 2000,
    allergies: [],
    excludedIngredients: [],
  });

  const { mutate, isPending } = useMutation<
    MealPlanResponse,
    Error,
    Preferences
  >({
    mutationFn: generateMealPlan,
  });

  const handlePreferencesChange = (newPreferences: Preferences) => {
    setPreferences(newPreferences);
  };

  // Core function to generate meal plan with an option to close sidebar on mobile
  const generateNewMealPlan = (closeSidebarOnMobile = false) => {
    setIsLimitReached(false);
    mutate(preferences, {
      onSuccess: (data) => {
        try {
          // Check if this is a limit reached response
          if ("limitReached" in data && data.limitReached === true) {
            setIsLimitReached(true);
            return;
          }

          setMealPlan(data);
          setActiveDayIndex(0);
          setError(null);
        } catch (error) {
          console.error("Error setting meal plan data:", error);
          alert(
            "Something went wrong with the meal plan data. Please try again."
          );
        }
      },
      onError: (error) => {
        console.error("Error generating meal plan:", error);
        setError("Error generating meal plan. Please try again.");
      },
    });

    if (closeSidebarOnMobile && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handlePreferencesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateNewMealPlan(true); // Close sidebar on mobile after form submission
  };

  const handleRegenerate = () => {
    generateNewMealPlan(false); // Don't close sidebar when regenerating
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Transform the API response to the format expected by components
  const displayData = useMemo(() => {
    return mealPlan ? transformMealPlanData(mealPlan) : [];
  }, [mealPlan]);

  // If we don't have data for the current active day index, reset to 0
  useEffect(() => {
    if (displayData.length <= activeDayIndex && displayData.length > 0) {
      setActiveDayIndex(0);
    }
  }, [displayData, activeDayIndex]);

  // Whether we have meal plan data to display
  const hasMealPlanData = displayData.length > 0;

  // Get selected day and calculate totals (if we have data)
  const selectedDay = useMemo(() => {
    return hasMealPlanData ? displayData[activeDayIndex] : null;
  }, [hasMealPlanData, displayData, activeDayIndex]);

  const dailyTotals = useMemo(() => {
    return selectedDay ? calculateDailyTotals(selectedDay.meals) : null;
  }, [selectedDay]);

  // Function to handle day change with logging
  const handleDayChange = (newIndex: number) => {
    console.log(`Changing day to index: ${newIndex}`);
    setActiveDayIndex(newIndex);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <SignedIn>
        {/* Mobile/Tablet preferences toggle - fixed at top of content - only shown when sidebar is closed */}
        {!sidebarOpen && (
          <div className="fixed top-[65px] left-0 right-0 z-30 lg:hidden bg-gray-900/90 backdrop-blur-md border-b border-gray-800 shadow-md">
            <div className="px-4 py-2.5">
              <button
                onClick={toggleSidebar}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                aria-label="Open meal preferences"
              >
                <HiOutlineMenu className="w-5 h-5" />
                <span className="font-medium">Meal Preferences</span>
              </button>
            </div>
          </div>
        )}

        {/* Preferences Sidebar */}
        <PreferencesSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          preferences={preferences}
          onPreferencesChange={handlePreferencesChange}
          onSubmit={handlePreferencesSubmit}
          isPending={isPending}
        />

        {/* Main content */}
        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? "lg:ml-80 md:ml-80" : "ml-0"
          } pt-[35px]`}
        >
          {/* Desktop sidebar toggle button - only shown when sidebar is closed */}
          {!sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="fixed top-1/2 left-0 -translate-y-1/2 z-50 hidden md:flex items-center justify-center w-6 h-24 bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-500 hover:to-purple-500 text-white rounded-r-lg shadow-lg transition-all duration-200"
              aria-label="Show sidebar"
            >
              <HiOutlineChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Add top padding for the header bar on mobile/tablet - only when the navbar is visible (sidebar closed) */}
          <div className={`${!sidebarOpen ? "pt-10 lg:pt-0" : "pt-0"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
              {/* Loading state */}
              {isPending && (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                  <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mb-4"></div>
                  <h3 className="text-xl font-semibold text-gray-200">
                    Generating your meal plan...
                  </h3>
                  <p className="text-gray-400 mt-2">This may take a moment</p>
                </div>
              )}

              {/* Main content for signed in users */}
              {!isPending && (
                <div>
                  {/* Header - responsive layout for mobile/tablet/desktop */}
                  <div className="mb-6 lg:mb-8">
                    <MealPlanHeader
                      onRegenerate={handleRegenerate}
                      hasMealPlanData={hasMealPlanData}
                    />
                  </div>

                  {/* Usage limit reached state */}
                  {isLimitReached && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                      <div className="bg-gray-800/50 rounded-lg p-8 max-w-md border border-amber-500/30">
                        <div className="bg-amber-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-amber-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-amber-300 mb-4">
                          Free Trial Limit Reached
                        </h3>
                        <p className="text-gray-300 mb-6">
                          You&apos;ve reached the limit of 5 meal plans on your
                          free trial. Subscribe now to continue generating
                          unlimited meal plans and unlock premium features.
                        </p>
                        <Link
                          href="/subscribe"
                          className="px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-medium rounded-lg shadow-lg transition-all duration-200 inline-flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Subscribe Now
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Empty state - when no meal plan data */}
                  {!hasMealPlanData && !error && !isLimitReached && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                      <div className="bg-gray-800/50 rounded-lg p-8 max-w-md">
                        <h3 className="text-xl font-semibold text-gray-200 mb-4">
                          No meal plan generated yet
                        </h3>
                        <p className="text-gray-400 mb-6">
                          Configure your dietary preferences in the sidebar and
                          click &quot;Generate Meal Plan&quot; to create your
                          personalized meal plan.
                        </p>
                        <button
                          onClick={() => setSidebarOpen(true)}
                          className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg transition-all duration-200"
                        >
                          Open Preferences
                        </button>
                      </div>
                    </div>
                  )}

                  {error && !isLimitReached && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                      <div className="bg-gray-800/50 rounded-lg p-8 max-w-md">
                        <h3 className="text-xl font-semibold text-gray-200 mb-4">
                          {error}
                        </h3>
                      </div>
                    </div>
                  )}

                  {/* Meal plan content - only show when we have data */}
                  {hasMealPlanData && !isLimitReached && (
                    <>
                      {/* Day selector - adjust padding for tablet */}
                      <div className="mb-6 lg:mb-8">
                        <DaySelector
                          days={displayData}
                          activeIndex={activeDayIndex}
                          onDayChange={handleDayChange}
                        />
                      </div>

                      {/* Meals for selected day - optimize grid for different screen sizes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8">
                        {selectedDay?.meals.map((meal, index) => (
                          <MealCard key={index} meal={meal} />
                        ))}
                      </div>

                      {/* Daily summary - adjusted padding for tablet */}
                      <div className="mb-6 lg:mb-8">
                        <NutritionSummary dailyTotals={dailyTotals!} />
                      </div>

                      {/* Action buttons - responsive layout */}
                      <ActionButtons mealPlan={displayData} />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <SignedOutContent />
      </SignedOut>
    </div>
  );
};

export default MealPlanPage;
