/**
 * API Route: Download Rendered Animation
 */

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

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

    const outputPath = path.join(
      process.cwd(),
      "public",
      "temp",
      "animator",
      `${jobId}.mp4`
    );

    // Check if file exists
    try {
      await fs.access(outputPath);
    } catch {
      return NextResponse.json(
        { error: "Animation not found" },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = await fs.readFile(outputPath);

    // Return file
    return new NextResponse(fileBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="animation-${jobId}.mp4"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      {
        error: "Failed to download animation",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
