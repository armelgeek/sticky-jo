"use client";

/**
 * Video Upload Component
 * Handles video file upload with drag-and-drop
 */

import { useState, useRef, DragEvent } from "react";

interface VideoUploadProps {
  onUploadComplete: (fileId: string, filename: string) => void;
  onError: (error: string) => void;
}

export default function VideoUpload({
  onUploadComplete,
  onError,
}: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleUpload(files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
    if (!allowedTypes.includes(file.type)) {
      onError("Invalid file type. Please upload MP4, MOV, or AVI files.");
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      onError("File too large. Maximum size is 100MB.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("video", file);

      const response = await fetch("/api/video/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onUploadComplete(data.fileId, data.filename);
    } catch (error) {
      console.error("Upload error:", error);
      onError(
        error instanceof Error ? error.message : "Failed to upload video"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${
            isDragging
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-700"
          }
          ${isUploading ? "opacity-50 pointer-events-none" : "cursor-pointer"}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/quicktime,video/x-msvideo"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {isUploading ? (
            <p className="text-gray-600 dark:text-gray-400">
              Uploading video...
            </p>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                MP4, MOV or AVI (max 100MB)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
