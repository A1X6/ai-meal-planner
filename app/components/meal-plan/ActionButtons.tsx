import React, { useState } from "react";
import Link from "next/link";
import { MdOutlineOpenInNew, MdSave } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { DayPlan } from "./types";

interface ActionButtonsProps {
  mealPlan: DayPlan[] | null;
}

// Function to save a meal plan
async function saveMealPlan(data: { name: string; mealPlanData: DayPlan[] }) {
  const response = await fetch("/api/saved-meal-plans", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to save meal plan");
  }

  return response.json();
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ mealPlan }) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [mealPlanName, setMealPlanName] = useState("");
  const [saveError, setSaveError] = useState("");

  const { mutate: saveMutation, isPending } = useMutation({
    mutationFn: saveMealPlan,
    onSuccess: () => {
      setShowSaveModal(false);
      setMealPlanName("");
      setSaveError("");
      // Could show a success toast here
    },
    onError: (error: Error) => {
      setSaveError(error.message);
    },
  });

  const handleSave = () => {
    if (!mealPlan || mealPlan.length === 0) {
      setSaveError("No meal plan to save");
      return;
    }
    setShowSaveModal(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealPlanName.trim()) {
      setSaveError("Please enter a name for your meal plan");
      return;
    }

    saveMutation({
      name: mealPlanName,
      mealPlanData: mealPlan || [],
    });
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={handleSave}
          className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all duration-200 ease-in-out shadow-lg shadow-green-500/20"
          disabled={!mealPlan || mealPlan.length === 0}
        >
          <MdSave className="mr-1.5 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
          Save Meal Plan
        </button>

        <Link
          href="/saved-meal-plans"
          className="flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 ease-in-out shadow-lg shadow-purple-500/20"
        >
          <MdOutlineOpenInNew className="mr-1.5 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />{" "}
          View Saved Meal Plans
        </Link>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">
              Save Meal Plan
            </h3>
            <form onSubmit={handleSaveSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="mealPlanName"
                  className="block text-gray-300 mb-2"
                >
                  Meal Plan Name
                </label>
                <input
                  type="text"
                  id="mealPlanName"
                  value={mealPlanName}
                  onChange={(e) => setMealPlanName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter a name for your meal plan"
                />
              </div>

              {saveError && (
                <div className="mb-4 text-red-400 text-sm">{saveError}</div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg transition-all duration-200 flex items-center"
                >
                  {isPending ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionButtons;
