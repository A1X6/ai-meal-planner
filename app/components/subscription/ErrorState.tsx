import React from "react";

interface ErrorStateProps {
  error: Error;
}

const ErrorState = ({ error }: ErrorStateProps) => (
  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
    <p className="text-red-600 dark:text-red-400">
      Error loading subscription data: {error.message}
    </p>
    <button
      onClick={() => window.location.reload()}
      className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-700"
    >
      Try Again
    </button>
  </div>
);

export default ErrorState;
