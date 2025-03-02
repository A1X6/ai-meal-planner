import React from "react";
import Link from "next/link";

const SignedOutContent: React.FC = () => {
  return (
    <div className="w-full transition-all duration-300 pt-[65px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Sign In to View Your Meal Plan
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Sign up or sign in to access your personalized meal plans, recipes,
            and shopping lists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 ease-in-out shadow-lg shadow-purple-500/20"
            >
              Sign Up
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-700 text-base font-medium rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 ease-in-out"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignedOutContent;
