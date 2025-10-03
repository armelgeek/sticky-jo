/**
 * API Route: Process Video
 * Starts video processing job
 */

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { processVideo } from "@/lib/video/processor";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes timeout

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, filename } = body;

    if (!fileId || !filename) {
      return NextResponse.json(
        { error: "Missing fileId or filename" },
        { status: 400 }
      );
    }

    // Construct file path
    const uploadDir = path.join(process.cwd(), "public", "temp", "uploads");
    const inputPath = path.join(uploadDir, filename);

    // Start processing (async)
    const outputDir = path.join(process.cwd(), "public", "temp", "output");
    
    // Start processing in background
    processVideo(inputPath, outputDir)
      .then((jobId) => {
        console.log(`Video processing completed with job ID: ${jobId}`);
      })
      .catch((error) => {
        console.error("Video processing error:", error);
      });

    // Return immediately with job ID
    // In a real system, you'd use a job queue
    const jobId = fileId; // Use fileId as jobId for simplicity

    return NextResponse.json({
      success: true,
      jobId: jobId,
      message: "Video processing started",
    });
  } catch (error) {
    console.error("Process error:", error);
    return NextResponse.json(
      {
        error: "Failed to start processing",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
