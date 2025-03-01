import React from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Your Personal AI Meal Planner
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get personalized meal plans, recipes, and shopping lists tailored to
            your dietary preferences and goals.
          </p>

          <SignedOut>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 ease-in-out shadow-lg shadow-purple-500/20"
              >
                Get Started
              </Link>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/meal-plan"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 ease-in-out shadow-lg shadow-purple-500/20"
              >
                View Your Meal Plan
              </Link>
              <Link
                href="/profile"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-700 text-base font-medium rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 ease-in-out"
              >
                Update Preferences
              </Link>
            </div>
          </SignedIn>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
              <div className="mb-4 p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg inline-block">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Custom Meal Plans
              </h3>
              <p className="text-gray-400">
                AI-generated meal plans tailored to your unique dietary needs.
              </p>
            </div>
            <div className="p-6 bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
              <div className="mb-4 p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg inline-block">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Nutritional Insights
              </h3>
              <p className="text-gray-400">
                Detailed nutritional information for every meal.
              </p>
            </div>
            <div className="p-6 bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
              <div className="mb-4 p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg inline-block">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Dietary Adjustments
              </h3>
              <p className="text-gray-400">
                Easily adjust your meal plans to fit your dietary preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
