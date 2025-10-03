/**
 * API Route: Processing Status
 * Get the status of a video processing job
 */

import { NextRequest, NextResponse } from "next/server";
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

    return NextResponse.json(status);
  } catch (error) {
    console.error("Status error:", error);
    return NextResponse.json(
      {
        error: "Failed to get status",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
