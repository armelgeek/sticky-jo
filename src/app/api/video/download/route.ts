/**
 * API Route: Download Video
 * Download the processed video
 */

import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { getProcessingStatus } from "@/lib/video/processor";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { error: "Missing jobId parameter" },
        { status: 400 }
      );
    }

    const status = getProcessingStatus(jobId);

    if (!status) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    if (status.status !== "completed" || !status.outputPath) {
      return NextResponse.json(
        { error: "Video not ready for download" },
        { status: 400 }
      );
    }

    // Read video file
    const videoBuffer = await readFile(status.outputPath);

    // Return video file with proper type
    return new NextResponse(new Uint8Array(videoBuffer), {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="stick-figure-${jobId}.mp4"`,
        "Content-Length": videoBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      {
        error: "Failed to download video",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
