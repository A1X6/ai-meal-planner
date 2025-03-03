import { plans, Plan } from "@/lib/plans";

// Subscription data interface
export interface SubscriptionData {
  isSubscribed: boolean;
  subscriptionTier?: string;
  subscriptionInterval?: string;
  cancelAtPeriodEnd?: boolean;
  usage: number;
  limit?: number | null;
}

// User data interface aligned with Clerk's UserResource
export interface UserData {
  imageUrl?: string;
  fullName?: string | null; // Updated to match UserResource null type
  username?: string | null; // Updated to match UserResource null type
  primaryEmailAddress?: {
    emailAddress: string;
  };
}

// Export Plan type for reuse
export type { Plan };
export { plans };
