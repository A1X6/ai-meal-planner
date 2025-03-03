import React from "react";
import { Plan } from "./types";

interface PlanOptionProps {
  plan: Plan;
  currentTier: string | undefined;
  currentInterval: string | undefined;
  onSelectPlan: (priceId: string) => void;
  isLoading: boolean;
}

const PlanOption = ({
  plan,
  currentTier,
  currentInterval,
  onSelectPlan,
  isLoading,
}: PlanOptionProps) => {
  const isCurrent = currentTier?.toLowerCase() === plan.name.toLowerCase();

  return (
    <div
      className={`relative border rounded-lg p-4 ${
        isCurrent
          ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      {isCurrent && (
        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          Current
        </span>
      )}
      <h5 className="font-medium text-gray-900 dark:text-white">{plan.name}</h5>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        {plan.price === 0
          ? "Free"
          : `$${plan.price}/month or $${(plan.price * 12 * 0.8).toFixed(
              2
            )}/year`}
      </p>
      <ul className="text-xs text-gray-600 dark:text-gray-400 mt-2 mb-4 space-y-1">
        {plan.features.slice(0, 3).map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <svg
              className="h-4 w-4 text-green-500 mr-1.5 mt-0.5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      {plan.id !== "free" && (
        <div className="mt-auto space-y-2">
          <button
            onClick={() => onSelectPlan(plan.priceId || "")}
            disabled={
              isLoading ||
              (isCurrent && currentInterval === "month") ||
              !plan.priceId
            }
            className={`w-full text-center px-3 py-1.5 text-xs rounded-md ${
              isCurrent && currentInterval === "month"
                ? "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isLoading
              ? "Loading..."
              : isCurrent && currentInterval === "month"
              ? "Current Plan"
              : "Switch to Monthly"}
          </button>
          <button
            onClick={() => onSelectPlan(plan.yearlyPriceId || "")}
            disabled={
              isLoading ||
              (isCurrent && currentInterval === "year") ||
              !plan.yearlyPriceId
            }
            className={`w-full text-center px-3 py-1.5 text-xs rounded-md ${
              isCurrent && currentInterval === "year"
                ? "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {isLoading
              ? "Loading..."
              : isCurrent && currentInterval === "year"
              ? "Current Plan"
              : "Switch to Yearly (Save 20%)"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PlanOption;
