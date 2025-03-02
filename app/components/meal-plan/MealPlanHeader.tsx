import React from "react";
import { HiOutlineRefresh } from "react-icons/hi";

interface MealPlanHeaderProps {
  onRegenerate: () => void;
  hasMealPlanData: boolean;
}

const MealPlanHeader: React.FC<MealPlanHeaderProps> = ({
  onRegenerate,
  hasMealPlanData,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Your Weekly Meal Plan
        </h1>
        <p className="text-sm sm:text-base text-gray-300">
          Personalized meals based on your dietary preferences and goals
        </p>
      </div>
      <div className="flex mt-3 md:mt-0 space-x-2 sm:space-x-3">
        {hasMealPlanData && (
          <button
            onClick={onRegenerate}
            className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-purple-500/30 bg-purple-500/10 text-purple-300 rounded-lg hover:bg-purple-500/20 transition-all duration-200 text-sm sm:text-base"
          >
            <HiOutlineRefresh className="mr-1 sm:mr-2" /> Regenerate
          </button>
        )}
      </div>
    </div>
  );
};

export default MealPlanHeader;
