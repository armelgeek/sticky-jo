"use client";

/**
 * Video Preview Component
 * Displays the processed video with download option
 */

interface VideoPreviewProps {
  jobId: string;
  onReset: () => void;
}

export default function VideoPreview({ jobId, onReset }: VideoPreviewProps) {
  const downloadUrl = `/api/video/download?jobId=${jobId}`;

  const handleDownload = () => {
    window.open(downloadUrl, "_blank");
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Your Stick Figure Video is Ready!
        </h3>

        <div className="space-y-4">
          <video
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700"
            controls
            src={downloadUrl}
          >
            Your browser does not support the video tag.
          </video>

          <div className="flex gap-4">
            <button
              onClick={handleDownload}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Video
            </button>

            <button
              onClick={onReset}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Process Another Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
