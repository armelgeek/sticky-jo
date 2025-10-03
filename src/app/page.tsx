"use client";

import { useState } from "react";
import VideoUpload from "@/components/VideoUpload";
import ProgressIndicator from "@/components/ProgressIndicator";
import VideoPreview from "@/components/VideoPreview";

type ProcessingState = "idle" | "uploading" | "processing" | "completed" | "error";

interface ProcessingStatus {
  progress: number;
  message: string;
  status: "idle" | "uploading" | "processing" | "completed" | "error";
}

export default function Home() {
  const [state, setState] = useState<ProcessingState>("idle");
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>({
    progress: 0,
    message: "",
    status: "idle",
  });
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = async (fileId: string, filename: string) => {
    setJobId(fileId);
    setState("processing");
    setStatus({
      progress: 5,
      message: "Starting video processing...",
      status: "processing",
    });

    try {
      // Start processing
      const response = await fetch("/api/video/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileId, filename }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Processing failed");
      }

      // Poll for status updates
      pollStatus(data.jobId);
    } catch (err) {
      console.error("Processing error:", err);
      setError(err instanceof Error ? err.message : "Failed to process video");
      setState("error");
    }
  };

  const pollStatus = async (jobId: string) => {
    const poll = async () => {
      try {
        const response = await fetch(`/api/video/status?jobId=${jobId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to get status");
        }

        setStatus({
          progress: data.progress,
          message: data.message,
          status: data.status,
        });

        if (data.status === "completed") {
          setState("completed");
          return;
        }

        if (data.status === "error") {
          setError(data.error || "Processing failed");
          setState("error");
          return;
        }

        // Continue polling
        setTimeout(poll, 2000);
      } catch (err) {
        console.error("Status poll error:", err);
        setError(err instanceof Error ? err.message : "Failed to get status");
        setState("error");
      }
    };

    poll();
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setState("error");
  };

  const handleReset = () => {
    setState("idle");
    setJobId(null);
    setStatus({ progress: 0, message: "", status: "idle" });
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Stick Figure Video Generator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              Upload your video and transform it into a minimalist stick figure
              animation with synchronized lip movements on a clean white
              background.
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href="/animator"
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                Create Animation Manually
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full flex flex-col items-center space-y-8">
            {state === "idle" && (
              <VideoUpload
                onUploadComplete={handleUploadComplete}
                onError={handleError}
              />
            )}

            {(state === "processing" || state === "uploading") && (
              <ProgressIndicator
                progress={status.progress}
                message={status.message}
                status={status.status}
              />
            )}

            {state === "completed" && jobId && (
              <VideoPreview jobId={jobId} onReset={handleReset} />
            )}

            {state === "error" && error && (
              <div className="w-full max-w-2xl">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <svg
                      className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        Error
                      </h3>
                      <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                        {error}
                      </p>
                      <button
                        onClick={handleReset}
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Easy Upload
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drag and drop your video or click to browse. Supports MP4, MOV,
                and AVI files.
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Pose Detection
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Advanced AI extracts body movements and creates smooth stick
                figure animations.
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828 2.828"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Lip Sync
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Mouth movements are synchronized with your video&apos;s audio for
                realistic talking animations.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

