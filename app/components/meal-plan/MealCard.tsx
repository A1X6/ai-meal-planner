import React from "react";
import { Meal } from "./types";
import MealIcon from "./MealIcon";

interface MealCardProps {
  meal: Meal;
}

const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 hover:border-purple-500/30 transition-all duration-300 overflow-hidden h-full flex flex-col">
      <div className="h-40 sm:h-44 md:h-48 overflow-hidden relative">
        <MealIcon mealType={meal.type} />
        <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
          {meal.type}
        </div>
      </div>
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">
          {meal.name}
        </h3>
        <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base line-clamp-2 flex-grow">
          {meal.description}
        </p>

        <div className="mt-auto">
          <div className="bg-gray-900/50 rounded-lg p-2 sm:p-3 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">Calories</p>
            <p className="text-white font-medium text-base sm:text-lg">
              {meal.calories}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
