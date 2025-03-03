"use client";

import { useState } from "react";
import { plans, getYearlyPrice, Plan } from "../../lib/plans";
import { CheckIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import toast, { Toaster } from "react-hot-toast";
import { PuffLoader } from "react-spinners";

type SubscribeResponse = {
  url: string;
};

type SubscribeError = {
  error: string;
};

async function subscribeToPlan(
  plan: Plan,
  billingInterval: "month" | "year",
  userId: string,
  email: string
): Promise<SubscribeResponse> {
  const response = await fetch("/api/check-out", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      billingInterval,
      userId,
      email,
      name: plan.name,
      priceId: plan.priceId,
      priceIdYearly: plan.yearlyPriceId,
    }),
  });
  if (!response.ok) {
    const errorData: SubscribeError = await response.json();
    throw new Error(errorData.error);
  }
  const data: SubscribeResponse = await response.json();
  return data;
}

const SubscribePage = () => {
  const { user } = useUser();
  const userId = user?.id;
  const email = user?.emailAddresses[0].emailAddress;
  const [billingInterval, setBillingInterval] = useState<"month" | "year">(
    "month"
  );
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const { mutate: subscribeMutation, isPending } = useMutation<
    SubscribeResponse,
    Error,
    { plan: Plan; billingInterval: "month" | "year" }
  >({
    mutationFn: async ({ plan, billingInterval }) => {
      if (!userId || !email) {
        throw new Error("User not found");
      }
      return subscribeToPlan(plan, billingInterval, userId, email);
    },
    onMutate: () => {
      toast.loading("Processing your payment...");
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: () => {
      toast.error("An error occurred while subscribing. Please try again.");
    },
  });

  const handleSubscribe = (plan: Plan) => {
    if (!isSignedIn || !userId || !email) {
      router.push("/sign-in");
      return;
    }

    // Call the mutation with both plan and billing interval
    subscribeMutation({ plan, billingInterval });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Toaster position="top-right" />
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Choose Your Meal Planning Journey
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          Unlock the full potential of AI-powered meal planning with our premium
          features.
        </p>

        {/* Billing interval toggle */}
        <div className="flex items-center justify-center mb-12">
          <div className="relative flex items-center p-1 rounded-full bg-gray-800 w-64">
            <button
              onClick={() => setBillingInterval("month")}
              className={`relative w-1/2 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                billingInterval === "month"
                  ? "text-gray-900 bg-violet-500"
                  : "text-gray-300"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval("year")}
              className={`relative w-1/2 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                billingInterval === "year"
                  ? "text-gray-900 bg-violet-500"
                  : "text-gray-300"
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-semibold tracking-wide text-white bg-green-500 rounded-full">
                20% OFF
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const price =
              billingInterval === "month"
                ? plan.price
                : getYearlyPrice(plan.price);

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: plans.indexOf(plan) * 0.1 }}
                className={`relative rounded-2xl overflow-hidden ${
                  plan.highlighted
                    ? "border-2 border-violet-500 bg-gray-800"
                    : "border border-gray-700 bg-gray-900"
                } p-8 shadow-xl flex flex-col h-full`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 bg-violet-500 text-white text-center py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 mb-4">{plan.description}</p>
                  <div className="flex items-end mb-6">
                    <span className="text-5xl font-extrabold text-white">
                      ${price}
                    </span>
                    <span className="text-xl text-gray-400 ml-2 mb-1">
                      /{billingInterval}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0 mr-3" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={
                    plan.id === "free"
                      ? () => router.push("/sign-up")
                      : () => handleSubscribe(plan)
                  }
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    plan.highlighted
                      ? "bg-violet-500 hover:bg-violet-600 text-white"
                      : plan.id === "free"
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                  } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isPending}
                >
                  {isPending ? (
                    <PuffLoader
                      color="#ffffff"
                      size={15}
                      cssOverride={{ margin: " 5px auto" }}
                    />
                  ) : plan.id === "free" ? (
                    "Get Started"
                  ) : (
                    "Subscribe Now"
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Satisfaction Guaranteed
          </h3>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Try any paid plan risk-free for 14 days. If you&apos;re not
            completely satisfied, let us know and we&apos;ll refund your
            payment. No questions asked.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscribePage;
