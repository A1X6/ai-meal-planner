import React from "react";
import { FaBowlFood } from "react-icons/fa6";
import { GiMeal, GiHotMeal } from "react-icons/gi";

interface MealIconProps {
  mealType: string;
}

const MealIcon: React.FC<MealIconProps> = ({ mealType }) => {
  const iconClasses = "w-16 h-16 sm:w-20 sm:h-20 transition-all duration-300";

  // Determine which icon to show based on meal type
  const getIcon = () => {
    const type = mealType.toLowerCase();

    if (type.includes("breakfast")) {
      return (
        <div className="relative">
          <div className="absolute inset-0 blur-md opacity-60 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
          <FaBowlFood
            className={`${iconClasses} relative z-10 text-transparent`}
            style={{ fill: "url(#mealGradient)" }}
          />
        </div>
      );
    } else if (type.includes("lunch")) {
      return (
        <div className="relative">
          <div className="absolute inset-0 blur-md opacity-60 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
          <GiMeal
            className={`${iconClasses} relative z-10 text-transparent`}
            style={{ fill: "url(#mealGradient)" }}
          />
        </div>
      );
    } else {
      // Dinner icon
      return (
        <div className="relative">
          <div className="absolute inset-0 blur-md opacity-60 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
          <GiHotMeal
            className={`${iconClasses} relative z-10 text-transparent`}
            style={{ fill: "url(#mealGradient)" }}
          />
        </div>
      );
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="mealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" /> {/* blue-500 */}
            <stop offset="100%" stopColor="#9333ea" /> {/* purple-600 */}
          </linearGradient>
        </defs>
      </svg>
      <div className="transform hover:scale-110 transition-transform duration-300">
        {getIcon()}
      </div>
    </div>
  );
};

export default MealIcon;
