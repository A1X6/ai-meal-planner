import React from "react";
import { NutritionTotals } from "./types";

interface NutritionSummaryProps {
  dailyTotals: NutritionTotals;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ dailyTotals }) => {
  return (
    <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-gray-700 p-4 sm:p-5 lg:p-6">
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
        Daily Nutrition Summary
      </h3>
      <div className="flex justify-center">
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 sm:p-5 border border-gray-700 w-full max-w-xs">
          <p className="text-gray-400 mb-1 sm:mb-2 text-sm sm:text-base text-center">
            Total Calories
          </p>
          <p className="text-2xl sm:text-3xl font-semibold text-white text-center">
            {dailyTotals.calories}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NutritionSummary;
