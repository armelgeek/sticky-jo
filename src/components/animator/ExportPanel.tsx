"use client";

import { useState } from "react";
import { Keyframe } from "@/app/animator/page";

interface ExportPanelProps {
  keyframes: Keyframe[];
  duration: number;
}

export default function ExportPanel({ keyframes, duration }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleExport = async () => {
    if (keyframes.length < 2) {
      alert("Please add at least 2 keyframes to export an animation.");
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setExportStatus("Preparing animation...");
    setDownloadUrl(null);

    try {
      // Send keyframes to API for rendering
      const response = await fetch("/api/animator/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyframes,
          duration,
          fps: 30,
        }),
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const data = await response.json();
      const jobId = data.jobId;

      // Poll for progress
      const pollInterval = setInterval(async () => {
        const statusResponse = await fetch(`/api/animator/status?jobId=${jobId}`);
        const statusData = await statusResponse.json();

        setExportProgress(statusData.progress);
        setExportStatus(statusData.message);

        if (statusData.status === "completed") {
          clearInterval(pollInterval);
          setDownloadUrl(`/api/animator/download?jobId=${jobId}`);
          setIsExporting(false);
        } else if (statusData.status === "error") {
          clearInterval(pollInterval);
          setExportStatus("Export failed: " + statusData.error);
          setIsExporting(false);
        }
      }, 1000);
    } catch (error) {
      console.error("Export error:", error);
      setExportStatus("Export failed. Please try again.");
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4 border-t border-gray-700 pt-4">
      <h3 className="text-lg font-semibold">Export Animation</h3>

      {!isExporting && !downloadUrl && (
        <button
          onClick={handleExport}
          disabled={keyframes.length < 2}
          className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Export as Video</span>
        </button>
      )}

      {isExporting && (
        <div className="space-y-2">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${exportProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 text-center">{exportStatus}</p>
        </div>
      )}

      {downloadUrl && (
        <div className="space-y-2">
          <a
            href={downloadUrl}
            download
            className="block w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded transition-colors text-center"
          >
            Download Video
          </a>
          <button
            onClick={() => {
              setDownloadUrl(null);
              setExportStatus("");
              setExportProgress(0);
            }}
            className="w-full px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm"
          >
            Export Another
          </button>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>Export settings:</p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Format: MP4</li>
          <li>FPS: 30</li>
          <li>Resolution: 512x512</li>
          <li>Keyframes: {keyframes.length}</li>
        </ul>
      </div>
    </div>
  );
}
