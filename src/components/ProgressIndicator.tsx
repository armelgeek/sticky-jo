"use client";

/**
 * Progress Indicator Component
 * Shows processing progress with percentage and message
 */

interface ProgressIndicatorProps {
  progress: number;
  message: string;
  status: "idle" | "uploading" | "processing" | "completed" | "error";
}

export default function ProgressIndicator({
  progress,
  message,
  status,
}: ProgressIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case "uploading":
        return "bg-blue-500";
      case "processing":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return (
          <svg
            className="w-6 h-6 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="animate-spin w-6 h-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="flex items-center space-x-4">
        {getStatusIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {message}
          </p>
        </div>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {progress}%
        </span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={`${getStatusColor()} h-2.5 rounded-full transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
