import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Toaster, toast } from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MdWarning } from "react-icons/md";

// Import components
import LoadingState from "./LoadingState";
import UnauthenticatedState from "./UnauthenticatedState";
import ErrorState from "./ErrorState";
import NoSubscriptionData from "./NoSubscriptionData";
import SubscriptionHeader from "./SubscriptionHeader";
import PlanSelection from "./PlanSelection";
import UsageInformation from "./UsageInformation";
import PremiumBenefits from "./PremiumBenefits";
import UserInfo from "./UserInfo";

// Import API functions and types
import {
  fetchSubscriptionStatus,
  changeSubscriptionPlan,
  cancelSubscription,
  reactivateSubscription,
} from "./api";
import { UserData } from "./types";

/**
 * SubscriptionStatus Component
 *
 * This component is responsible for displaying the user's subscription status
 * and handling subscription plan changes.
 */
const SubscriptionStatus = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isManuallyLoading, setIsManuallyLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const queryClient = useQueryClient();

  // Fetch subscription data
  const {
    data,
    isLoading: isQueryLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["subscriptionStatus"],
    queryFn: fetchSubscriptionStatus,
    enabled: isSignedIn && isLoaded,
    refetchOnWindowFocus: false,
  });

  // Set local error state when query error occurs
  useEffect(() => {
    if (queryError) {
      setError(queryError as Error);
    }
  }, [queryError]);

  // Handle plan change
  const handleChangePlan = async (planId: string) => {
    try {
      setIsLoading(true);
      const responseData = await changeSubscriptionPlan(planId);

      // Check if this is a direct update or redirect flow
      if (responseData.success) {
        // Direct subscription update successful
        toast.success("Subscription updated successfully!");

        // Close the plan selection view
        setIsChangingPlan(false);

        // Refetch subscription data to reflect the changes
        queryClient.invalidateQueries({ queryKey: ["subscriptionStatus"] });

        // Show a temporary loading state until the data refreshes
        setIsManuallyLoading(true);

        // After a short delay, ensure the loading state is cleared in case the query takes too long
        setTimeout(() => {
          setIsManuallyLoading(false);
        }, 2000);
      } else if (responseData.url) {
        // Redirect to Stripe checkout for new subscriptions
        window.location.href = responseData.url;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error changing plan:", error);
      toast.error("Failed to change plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    try {
      setIsLoading(true);
      const response = await cancelSubscription();

      if (response.error) {
        setError(response.error);
      } else {
        toast.success(
          "Your subscription has been canceled and will end after the current billing period"
        );

        // Refetch subscription data to reflect the changes
        queryClient.invalidateQueries({ queryKey: ["subscriptionStatus"] });

        // Show a temporary loading state until the data refreshes
        setIsManuallyLoading(true);

        // After a short delay, ensure the loading state is cleared in case the query takes too long
        setTimeout(() => {
          setIsManuallyLoading(false);
        }, 2000);
      }
    } catch (err) {
      setError(err as Error);
      console.error("Error canceling subscription:", err);
      toast.error(
        "Failed to cancel subscription. Please try again or contact support."
      );
    } finally {
      setIsLoading(false);
      setShowCancelModal(false);
    }
  };

  const cancelCancellation = () => {
    setShowCancelModal(false);
  };

  // Handle subscription reactivation
  const handleReactivateSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await reactivateSubscription();

      if (response.error) {
        setError(response.error);
        toast.error(
          "Failed to reactivate your subscription. Please try again."
        );
      } else {
        toast.success("Your subscription has been reactivated successfully!");

        // Refetch subscription data to reflect the changes
        queryClient.invalidateQueries({ queryKey: ["subscriptionStatus"] });

        // Show a temporary loading state until the data refreshes
        setIsManuallyLoading(true);

        // After a short delay, ensure the loading state is cleared in case the query takes too long
        setTimeout(() => {
          setIsManuallyLoading(false);
        }, 2000);
      }
    } catch (err) {
      setError(err as Error);
      console.error("Error reactivating subscription:", err);
      toast.error(
        "Failed to reactivate subscription. Please try again or contact support."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state if Clerk auth is not yet loaded
  if (!isLoaded) {
    return <LoadingState />;
  }

  // Show unauthenticated state if user is not signed in
  if (!isSignedIn) {
    return <UnauthenticatedState />;
  }

  // Convert Clerk user to our UserData type
  const userData: UserData = {
    imageUrl: user?.imageUrl,
    fullName: user?.fullName,
    username: user?.username,
    primaryEmailAddress: user?.primaryEmailAddress
      ? {
          emailAddress: user.primaryEmailAddress.emailAddress,
        }
      : undefined,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <Toaster position="top-center" />
      <div className="p-6">
        {isQueryLoading || isManuallyLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <ErrorState error={error as Error} />
        ) : data ? (
          <div className="space-y-6">
            <SubscriptionHeader
              data={data}
              isSubscribed={data.isSubscribed}
              onChangePlan={() => setIsChangingPlan(!isChangingPlan)}
              onCancelSubscription={
                data.isSubscribed ? handleCancelSubscription : undefined
              }
              onReactivateSubscription={
                data.isSubscribed && data.cancelAtPeriodEnd
                  ? handleReactivateSubscription
                  : undefined
              }
            />

            {isChangingPlan && (
              <PlanSelection
                data={data}
                isLoading={isLoading}
                onChangePlan={handleChangePlan}
              />
            )}

            <UsageInformation data={data} />

            {data.isSubscribed && !isChangingPlan && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-5 mt-6">
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {data.cancelAtPeriodEnd
                    ? "Your subscription is set to cancel at the end of the billing period. You can reactivate anytime before then."
                    : "You can cancel your subscription at any time. You'll continue to have access until the end of your billing period."}
                </p>
              </div>
            )}

            {!data.isSubscribed && <PremiumBenefits />}

            <UserInfo user={userData} />
          </div>
        ) : (
          <NoSubscriptionData />
        )}
      </div>

      {/* Cancel Subscription Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full">
            <div className="flex items-center mb-4 text-amber-400">
              <MdWarning className="w-6 h-6 mr-2" />
              <h3 className="text-xl font-semibold">Confirm Cancellation</h3>
            </div>
            <div className="text-gray-700 dark:text-gray-300 mb-6 space-y-2">
              <p>Are you sure you want to cancel your subscription?</p>
              <ul className="list-disc pl-5 text-sm">
                <li>
                  Your subscription will remain active until the end of your
                  current billing period
                </li>
                <li>You won&apos;t be charged again</li>
                <li>You can reactivate at any time before the period ends</li>
              </ul>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelCancellation}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors duration-200"
              >
                No, Keep Subscription
              </button>
              <button
                onClick={confirmCancellation}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 flex items-center"
              >
                Yes, Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;
