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
    
    // Use fileId as jobId for consistency
    const jobId = fileId;
    
    // Start processing in background
    processVideo(inputPath, outputDir, jobId)
      .then((returnedJobId) => {
        console.log(`Video processing completed with job ID: ${returnedJobId}`);
      })
      .catch((error) => {
        console.error("Video processing error:", error);
      });

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
