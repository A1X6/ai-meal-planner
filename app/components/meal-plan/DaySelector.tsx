import React from "react";
import { DayPlan } from "./types";

interface DaySelectorProps {
  days: DayPlan[];
  activeIndex: number;
  onDayChange: (index: number) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  days,
  activeIndex,
  onDayChange,
}) => {
  return (
    <div className="flex overflow-x-auto pb-2 mb-4 sm:mb-6 lg:mb-8 border-b border-gray-800 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
      {days.map((day, index) => (
        <button
          key={day.day}
          onClick={() => onDayChange(index)}
          className={`flex-shrink-0 px-4 sm:px-6 py-2 sm:py-3 font-medium text-sm rounded-t-lg transition-all duration-200 ${
            activeIndex === index
              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-b-2 border-purple-400"
              : "text-gray-400 hover:text-white hover:bg-gray-800/50"
          }`}
        >
          {day.day}
        </button>
      ))}
    </div>
  );
};

export default DaySelector;
