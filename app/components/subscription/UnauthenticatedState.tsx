import React from "react";
import Link from "next/link";

const UnauthenticatedState = () => (
  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
    <p className="text-gray-600 dark:text-gray-300 mb-3">
      Please sign in to view your subscription status.
    </p>
    <Link
      href="/sign-in"
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      Sign In
    </Link>
  </div>
);

export default UnauthenticatedState;
