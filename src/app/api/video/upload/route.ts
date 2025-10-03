/**
 * API Route: Upload Video
 * Handles video file uploads
 */

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

// Increase max file size
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("video") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No video file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload MP4, MOV, or AVI files." },
        { status: 400 }
      );
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 100MB." },
        { status: 400 }
      );
    }

    // Create upload directory
    const uploadDir = path.join(process.cwd(), "public", "temp", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const fileId = uuidv4();
    const extension = file.name.split(".").pop() || "mp4";
    const filename = `${fileId}.${extension}`;
    const filepath = path.join(uploadDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    return NextResponse.json({
      success: true,
      fileId: fileId,
      filename: filename,
      filepath: filepath,
      size: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
