/**
 * API Route: Get Animation Export Status
 */

import { NextRequest, NextResponse } from "next/server";
import { getAnimationStatus } from "@/lib/animator/renderer";

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

    const status = await getAnimationStatus(jobId);
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
