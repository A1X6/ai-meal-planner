import React from "react";
import { SubscriptionData } from "./types";

interface UsageInformationProps {
  data: SubscriptionData;
}

const UsageInformation = ({ data }: UsageInformationProps) => (
  <div>
    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
      Meal Plan Usage
    </h3>

    {data.isSubscribed ? (
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          You have unlimited meal plan generations with your premium
          subscription.
        </p>

        <div className="mt-3 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated Meal Plans
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {data.usage} plans
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Plan Level
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
              {data.subscriptionTier || "Premium"}
              {data.cancelAtPeriodEnd && " (Canceling)"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Billing Cycle
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {data.subscriptionInterval === "month" ? "Monthly" : "Yearly"}
            </span>
          </div>
        </div>
      </div>
    ) : (
      <div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>
            Used: {data.usage} of {data.limit || 5}
          </span>
          <span>
            {Math.min((data.usage / (data.limit || 5)) * 100, 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
            style={{
              width: `${Math.min(
                (data.usage / (data.limit || 5)) * 100,
                100
              )}%`,
            }}
          ></div>
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {data.limit && data.usage >= data.limit
            ? "You've reached your free trial limit. Subscribe for unlimited meal plans."
            : "Free trial allows up to 5 meal plan generations. Subscribe for unlimited access."}
        </p>
      </div>
    )}
  </div>
);

export default UsageInformation;
