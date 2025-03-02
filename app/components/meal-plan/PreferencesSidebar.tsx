import React from "react";
import { HiOutlineX, HiOutlineChevronLeft } from "react-icons/hi";
import { Preferences, allergyOptions, dietTypes } from "./types";
import { PuffLoader } from "react-spinners";

interface PreferencesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: Preferences;
  onPreferencesChange: (preferences: Preferences) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

const PreferencesSidebar: React.FC<PreferencesSidebarProps> = ({
  isOpen,
  onClose,
  preferences,
  onPreferencesChange,
  onSubmit,
  isPending,
}) => {
  const handleAllergyToggle = (allergyValue: string) => {
    const updatedPreferences = { ...preferences };
    if (preferences.allergies.includes(allergyValue)) {
      updatedPreferences.allergies = preferences.allergies.filter(
        (a) => a !== allergyValue
      );
    } else {
      updatedPreferences.allergies = [...preferences.allergies, allergyValue];
    }
    onPreferencesChange(updatedPreferences);
  };

  const handleExcludedIngredients = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const ingredients = e.target.value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    onPreferencesChange({
      ...preferences,
      excludedIngredients: ingredients,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    onPreferencesChange({
      ...preferences,
      [name]: name === "calorieTarget" ? parseInt(value, 10) : value,
    });
  };

  return (
    <>
      {/* Backdrop overlay for mobile & tablet */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-[65px] bottom-0 left-0 z-40 w-[320px] md:w-80 bg-gray-900/95 backdrop-blur-md border-r border-gray-800 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto lg:p-6">
          {/* Add padding to top on mobile/tablet to account for the fixed header */}
          <div className="p-4 sm:p-6 lg:p-0 pt-12 lg:pt-0">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Meal Preferences
              </h2>
              {/* Mobile & tablet close button */}
              <button
                onClick={onClose}
                className="lg:hidden text-gray-400 hover:text-white transition-colors duration-200 p-1"
                aria-label="Close sidebar"
              >
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>

            {/* Hide sidebar button on right edge (desktop only) - only shown when sidebar is open */}
            {isOpen && (
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 hidden lg:block">
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-6 h-24 bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500 text-white rounded-l-lg shadow-lg transition-all duration-200"
                  aria-label="Hide sidebar"
                >
                  <HiOutlineChevronLeft className="w-5 h-5" />
                </button>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5 sm:space-y-6">
              {/* Diet Type */}
              <div>
                <label
                  htmlFor="dietType"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Diet Type
                </label>
                <select
                  id="dietType"
                  name="dietType"
                  value={preferences.dietType}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {dietTypes.map((diet) => (
                    <option key={diet.value} value={diet.value}>
                      {diet.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Calorie Target */}
              <div>
                <label
                  htmlFor="calorieTarget"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Daily Calorie Target
                </label>
                <input
                  type="number"
                  id="calorieTarget"
                  name="calorieTarget"
                  min="1000"
                  max="5000"
                  step="50"
                  value={preferences.calorieTarget}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Allergies & Intolerances
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1">
                  {allergyOptions.map((allergy) => (
                    <div key={allergy.value} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`allergy-${allergy.value}`}
                        checked={preferences.allergies.includes(allergy.value)}
                        onChange={() => handleAllergyToggle(allergy.value)}
                        className="mr-2 h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
                      />
                      <label
                        htmlFor={`allergy-${allergy.value}`}
                        className="text-sm text-gray-300"
                      >
                        {allergy.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Excluded Ingredients */}
              <div>
                <label
                  htmlFor="excludedIngredients"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Excluded Ingredients
                </label>
                <textarea
                  id="excludedIngredients"
                  placeholder="Enter ingredients separated by commas"
                  value={preferences.excludedIngredients.join(", ")}
                  onChange={handleExcludedIngredients}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:ring-purple-500 focus:border-purple-500 h-20 sm:h-24 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter ingredients you want to exclude from your meal plan.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/20 ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isPending}
              >
                {isPending ? (
                  <PuffLoader
                    color="#ffffff"
                    size={15}
                    cssOverride={{ margin: " 3px auto" }}
                  />
                ) : (
                  "Generate Meal Plan"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreferencesSidebar;
