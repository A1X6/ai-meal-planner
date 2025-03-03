import React from "react";
import Link from "next/link";
import { SubscriptionData } from "./types";
import { HiOutlineInformationCircle } from "react-icons/hi";

interface SubscriptionHeaderProps {
  data: SubscriptionData;
  isSubscribed: boolean;
  onChangePlan: () => void;
  onCancelSubscription?: () => void;
  onReactivateSubscription?: () => void;
}

const SubscriptionHeader = ({
  data,
  isSubscribed,
  onChangePlan,
  onCancelSubscription,
  onReactivateSubscription,
}: SubscriptionHeaderProps) => (
  <div className="flex flex-col space-y-4">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Subscription Status
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isSubscribed
            ? data.cancelAtPeriodEnd
              ? "Your subscription will cancel at the end of the billing period"
              : "Your subscription is active"
            : "You are on the free plan"}
        </p>
        {data.subscriptionTier && (
          <p className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
            {data.subscriptionTier}
            {" • "}
            {data.subscriptionInterval === "month" ? "Monthly" : "Yearly"}
          </p>
        )}
      </div>
      <div className="mt-4 md:mt-0 space-x-2">
        {!isSubscribed ? (
          <Link
            href="/subscribe"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Upgrade to Premium
          </Link>
        ) : (
          <>
            <button
              onClick={onChangePlan}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Change Plan
            </button>
            {!data.cancelAtPeriodEnd && onCancelSubscription && (
              <button
                onClick={onCancelSubscription}
                className="inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-800 rounded-md shadow-sm text-sm font-medium text-red-700 dark:text-red-300 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-gray-600"
              >
                Cancel Subscription
              </button>
            )}
          </>
        )}
      </div>
    </div>

    {data.cancelAtPeriodEnd && (
      <div className="p-4 border border-yellow-200 dark:border-yellow-900 rounded-md bg-yellow-50 dark:bg-yellow-900/30 flex items-start">
        <HiOutlineInformationCircle className="text-yellow-600 dark:text-yellow-500 mt-0.5 mr-2 text-lg flex-shrink-0" />
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <p className="font-medium mb-1">Subscription Canceling</p>
          <p>
            Your premium features will remain active until the end of your
            current billing period. You won&apos;t be charged again.
          </p>
          <p className="mt-2">
            <button
              onClick={onReactivateSubscription}
              className="text-green-600 dark:text-green-400 font-medium hover:underline"
            >
              Reactivate subscription
            </button>
          </p>
        </div>
      </div>
    )}
  </div>
);

export default SubscriptionHeader;
