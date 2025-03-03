import React from "react";
import PlanOption from "./PlanOption";
import { SubscriptionData, plans } from "./types";

interface PlanSelectionProps {
  data: SubscriptionData;
  isLoading: boolean;
  onChangePlan: (planId: string) => void;
}

const PlanSelection = ({
  data,
  isLoading,
  onChangePlan,
}: PlanSelectionProps) => (
  <div className="mt-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
      Available Plans
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {plans.map((plan) => (
        <PlanOption
          key={plan.id}
          plan={plan}
          currentTier={data.subscriptionTier}
          currentInterval={data.subscriptionInterval}
          onSelectPlan={onChangePlan}
          isLoading={isLoading}
        />
      ))}
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
      * Changing plans will update your subscription immediately. You&apos;ll be
      charged or credited the prorated amount.
    </p>
  </div>
);

export default PlanSelection;
