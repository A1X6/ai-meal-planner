// API Fetching function for subscription data
export const fetchSubscriptionStatus = async () => {
  const res = await fetch("/api/profile/subscription-status");
  if (!res.ok) {
    throw new Error("Failed to fetch subscription status");
  }
  return res.json();
};

// API function to change subscription plan
export const changeSubscriptionPlan = async (planId: string) => {
  const response = await fetch("/api/profile/change-plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      newPlanId: planId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to change plan");
  }

  return data;
};

// API function to cancel subscription
export const cancelSubscription = async () => {
  const response = await fetch("/api/profile/unsubscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to cancel subscription");
  }

  return data;
};

// API function to reactivate a subscription that was set to cancel
export const reactivateSubscription = async () => {
  const response = await fetch("/api/profile/reactivate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to reactivate subscription");
  }

  return data;
};
