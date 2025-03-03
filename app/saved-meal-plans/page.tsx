"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  MdHourglassEmpty,
  MdDeleteOutline,
  MdCalendarViewWeek,
  MdWarning,
} from "react-icons/md";
import { HiArrowLeft } from "react-icons/hi";
import { SavedMealPlan } from "../components/meal-plan/types";
import { formatDate } from "../lib/utils";

// Function to fetch saved meal plans
const fetchSavedMealPlans = async (): Promise<SavedMealPlan[]> => {
  const response = await fetch("/api/saved-meal-plans");
  if (!response.ok) {
    throw new Error("Failed to fetch saved meal plans");
  }
  return response.json();
};

// Function to delete a meal plan
const deleteMealPlan = async (id: string): Promise<void> => {
  const response = await fetch(`/api/saved-meal-plans?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete meal plan");
  }

  return;
};

const SavedMealPlansPage: React.FC = () => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [mealPlanToDelete, setMealPlanToDelete] = useState<string | null>(null);

  const {
    data: savedMealPlans,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["savedMealPlans"],
    queryFn: fetchSavedMealPlans,
  });

  const confirmDelete = (id: string) => {
    setMealPlanToDelete(id);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setMealPlanToDelete(null);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteMealPlan(id);
      refetch(); // Refetch the list after deletion
    } catch (error) {
      console.error("Error deleting meal plan:", error);
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(false);
      setMealPlanToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <SignedIn>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col gap-8">
            {/* Header with navigation */}
            <div className="flex flex-col gap-2">
              <Link
                href="/meal-plan"
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200 w-fit"
              >
                <HiArrowLeft className="mr-1" />
                <span>Back to Meal Planner</span>
              </Link>
              <h1 className="text-3xl font-bold text-white">
                Saved Meal Plans
              </h1>
              <p className="text-gray-400">
                Your personalized meal plans that you&apos;ve saved for later.
              </p>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-200">
                  Loading your meal plans...
                </h3>
              </div>
            )}

            {/* Error state */}
            {isError && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-300">
                <p>
                  Error loading your saved meal plans:{" "}
                  {(error as Error).message}
                </p>
              </div>
            )}

            {/* Empty state */}
            {!isLoading &&
              !isError &&
              (!savedMealPlans || savedMealPlans.length === 0) && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="bg-gray-800/50 rounded-lg p-8 max-w-md">
                    <MdHourglassEmpty className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-200 mb-4">
                      No saved meal plans yet
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Generate a meal plan and save it to see it here. Your
                      saved meal plans will make meal preparation easier!
                    </p>
                    <Link
                      href="/meal-plan"
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg transition-all duration-200"
                    >
                      Create a Meal Plan
                    </Link>
                  </div>
                </div>
              )}

            {/* Meal plans grid */}
            {!isLoading &&
              !isError &&
              savedMealPlans &&
              savedMealPlans.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedMealPlans.map((mealPlan) => (
                    <div
                      key={mealPlan.id}
                      className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/10 hover:border-gray-600"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-semibold text-white">
                            {mealPlan.name}
                          </h3>
                          <button
                            onClick={() => confirmDelete(mealPlan.id)}
                            disabled={deletingId === mealPlan.id}
                            className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                            aria-label="Delete meal plan"
                          >
                            {deletingId === mealPlan.id ? (
                              <div className="w-5 h-5 border-t-2 border-b-2 border-red-400 rounded-full animate-spin"></div>
                            ) : (
                              <MdDeleteOutline className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center text-gray-400 text-sm mb-5">
                          <span>Created {formatDate(mealPlan.createdAt)}</span>
                        </div>

                        <div className="text-gray-300 mb-6">
                          <p className="text-sm">
                            {mealPlan.mealPlanData.length} days of delicious
                            meals
                          </p>
                        </div>

                        <Link
                          href={`/meal-plan-details/${mealPlan.id}`}
                          className="flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all duration-200"
                        >
                          <MdCalendarViewWeek className="mr-2" />
                          View Meal Plan
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <div className="bg-gray-800/50 rounded-lg p-8 max-w-md">
            <h3 className="text-xl font-semibold text-gray-200 mb-4">
              Sign in to view your saved meal plans
            </h3>
            <p className="text-gray-400 mb-6">
              Please sign in to access your saved meal plans. Once signed in,
              you can view, manage, and create new meal plans.
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-md w-full">
            <div className="flex items-center mb-4 text-amber-400">
              <MdWarning className="w-6 h-6 mr-2" />
              <h3 className="text-xl font-semibold">Confirm Deletion</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this meal plan? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                No, Cancel
              </button>
              <button
                onClick={() =>
                  mealPlanToDelete && handleDelete(mealPlanToDelete)
                }
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 flex items-center"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedMealPlansPage;
