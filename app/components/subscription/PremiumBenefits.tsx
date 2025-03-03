import React from "react";

const PremiumBenefits = () => (
  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mt-4">
    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
      Premium Benefits
    </h3>
    <ul className="space-y-2">
      <li className="flex items-start">
        <svg
          className="h-5 w-5 text-green-500 mr-2"
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
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Unlimited meal plan generations
        </span>
      </li>
      <li className="flex items-start">
        <svg
          className="h-5 w-5 text-green-500 mr-2"
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
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Advanced nutritional tracking
        </span>
      </li>
      <li className="flex items-start">
        <svg
          className="h-5 w-5 text-green-500 mr-2"
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
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Priority support
        </span>
      </li>
    </ul>
  </div>
);

export default PremiumBenefits;
