/**
 * API Route: Export Animation
 * Starts animation rendering job
 */

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import { renderAnimation } from "@/lib/animator/renderer";

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes timeout

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyframes, duration, fps = 30 } = body;

    if (!keyframes || !Array.isArray(keyframes) || keyframes.length < 2) {
      return NextResponse.json(
        { error: "At least 2 keyframes are required" },
        { status: 400 }
      );
    }

    const jobId = uuidv4();
    const outputDir = path.join(process.cwd(), "public", "temp", "animator");
    await fs.mkdir(outputDir, { recursive: true });

    // Start rendering in background
    renderAnimation(jobId, keyframes, duration, fps, outputDir)
      .then(() => {
        console.log(`Animation rendering completed with job ID: ${jobId}`);
      })
      .catch((error) => {
        console.error("Animation rendering error:", error);
      });

    return NextResponse.json({
      success: true,
      jobId: jobId,
      message: "Animation rendering started",
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      {
        error: "Failed to start export",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
