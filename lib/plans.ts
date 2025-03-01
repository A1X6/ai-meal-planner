export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  description: string;
  features: string[];
  highlighted?: boolean;
  priceId?: string; // For monthly Stripe integration
  yearlyPriceId?: string; // For yearly Stripe integration
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month",
    description: "Basic meal planning for individuals",
    features: [
      "Generate up to 3 meal plans per month",
      "Access to basic recipes",
      "Save up to 5 favorite recipes",
      "Basic nutritional information",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 9.99,
    interval: "month",
    description: "Advanced meal planning for health enthusiasts",
    features: [
      "Unlimited meal plan generation",
      "Access to premium recipe collection",
      "Detailed nutritional analysis",
      "Custom dietary preferences",
      "Shopping list generation",
      "Save unlimited favorite recipes",
    ],
    highlighted: true,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID,
  },
  {
    id: "family",
    name: "Family",
    price: 19.99,
    interval: "month",
    description: "Complete solution for families",
    features: [
      "Everything in Premium",
      "Family-sized recipe portions",
      "Multiple dietary preferences per plan",
      "Meal prep guides for busy weeks",
      "Budget-friendly options",
      "Priority customer support",
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_FAMILY_MONTHLY_PRICE_ID,
    yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_FAMILY_YEARLY_PRICE_ID,
  },
];

export const getYearlyPrice = (monthlyPrice: number): number => {
  // 20% discount for yearly plans
  return Number((monthlyPrice * 12 * 0.8).toFixed(2));
};
