/**
 * Main video processor
 * Orchestrates the entire stick figure video generation pipeline
 */

import path from "path";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import {
  extractFrames,
  extractAudio,
  getVideoMetadata,
  assembleVideo,
} from "./ffmpeg";
import { extractPoseFromImage, initializePoseLandmarker } from "./poseEstimation";
import { drawStickFigure } from "./stickFigure";
import { generateSimpleLipSync } from "./audioAnalysis";

export interface ProcessingStatus {
  id: string;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  message: string;
  outputPath?: string;
  error?: string;
}

const processingJobs = new Map<string, ProcessingStatus>();

/**
 * Get the status of a processing job
 */
export function getProcessingStatus(jobId: string): ProcessingStatus | null {
  return processingJobs.get(jobId) || null;
}

/**
 * Update processing status
 */
function updateStatus(
  jobId: string,
  updates: Partial<ProcessingStatus>
): void {
  const current = processingJobs.get(jobId);
  if (current) {
    processingJobs.set(jobId, { ...current, ...updates });
  }
}

/**
 * Process video to generate stick figure animation
 */
export async function processVideo(
  inputVideoPath: string,
  outputDir: string
): Promise<string> {
  const jobId = uuidv4();
  
  processingJobs.set(jobId, {
    id: jobId,
    status: "processing",
    progress: 0,
    message: "Initializing...",
  });

  try {
    // Create working directories
    const workDir = path.join(outputDir, jobId);
    const framesDir = path.join(workDir, "frames");
    const stickFramesDir = path.join(workDir, "stick_frames");
    const audioPath = path.join(workDir, "audio.aac");
    const outputPath = path.join(workDir, "output.mp4");

    await fs.mkdir(workDir, { recursive: true });
    await fs.mkdir(framesDir, { recursive: true });
    await fs.mkdir(stickFramesDir, { recursive: true });

    // Step 1: Get video metadata
    updateStatus(jobId, {
      progress: 5,
      message: "Analyzing video...",
    });
    
    await getVideoMetadata(inputVideoPath);
    const targetFps = 10; // Process at 10 FPS for performance

    // Step 2: Extract audio
    updateStatus(jobId, {
      progress: 10,
      message: "Extracting audio...",
    });
    
    await extractAudio(inputVideoPath, audioPath);

    // Step 3: Extract frames
    updateStatus(jobId, {
      progress: 20,
      message: "Extracting frames...",
    });
    
    const frameFiles = await extractFrames(inputVideoPath, framesDir, targetFps);
    const totalFrames = frameFiles.length;

    if (totalFrames === 0) {
      throw new Error("No frames extracted from video");
    }

    // Step 4: Initialize pose detector
    updateStatus(jobId, {
      progress: 30,
      message: "Initializing pose detector...",
    });
    
    await initializePoseLandmarker();

    // Step 5: Generate lip sync data
    updateStatus(jobId, {
      progress: 35,
      message: "Analyzing audio for lip sync...",
    });
    
    const mouthStates = generateSimpleLipSync(totalFrames, targetFps);

    // Step 6: Process each frame
    updateStatus(jobId, {
      progress: 40,
      message: "Processing frames...",
    });

    for (let i = 0; i < frameFiles.length; i++) {
      const frameFile = frameFiles[i];
      const frameNumber = i + 1;
      
      // Update progress
      const frameProgress = 40 + Math.floor((i / totalFrames) * 50);
      updateStatus(jobId, {
        progress: frameProgress,
        message: `Processing frame ${frameNumber}/${totalFrames}...`,
      });

      // Extract pose from frame
      const pose = await extractPoseFromImage(frameFile);

      if (pose) {
        // Draw stick figure with lip sync
        const stickFramePath = path.join(
          stickFramesDir,
          `frame_${String(frameNumber).padStart(4, "0")}.png`
        );

        await drawStickFigure(pose, stickFramePath, {
          width: 512,
          height: 512,
          mouthOpen: mouthStates[i],
        });
      } else {
        // If pose detection fails, create blank frame
        console.warn(`No pose detected in frame ${frameNumber}`);
        const stickFramePath = path.join(
          stickFramesDir,
          `frame_${String(frameNumber).padStart(4, "0")}.png`
        );
        
        // Copy a blank white frame
        await drawStickFigure(
          {
            nose: { x: 0.5, y: 0.3 },
            leftShoulder: { x: 0.4, y: 0.45 },
            rightShoulder: { x: 0.6, y: 0.45 },
            leftElbow: { x: 0.35, y: 0.6 },
            rightElbow: { x: 0.65, y: 0.6 },
            leftWrist: { x: 0.3, y: 0.75 },
            rightWrist: { x: 0.7, y: 0.75 },
            leftHip: { x: 0.45, y: 0.65 },
            rightHip: { x: 0.55, y: 0.65 },
            leftKnee: { x: 0.45, y: 0.8 },
            rightKnee: { x: 0.55, y: 0.8 },
            leftAnkle: { x: 0.45, y: 0.95 },
            rightAnkle: { x: 0.55, y: 0.95 },
          },
          stickFramePath,
          { mouthOpen: false }
        );
      }
    }

    // Step 7: Assemble final video
    updateStatus(jobId, {
      progress: 90,
      message: "Assembling final video...",
    });

    await assembleVideo(stickFramesDir, audioPath, outputPath, targetFps);

    // Step 8: Complete
    updateStatus(jobId, {
      status: "completed",
      progress: 100,
      message: "Video processing completed!",
      outputPath: outputPath,
    });

    // Clean up intermediate files after a delay
    setTimeout(async () => {
      try {
        await fs.rm(framesDir, { recursive: true, force: true });
        await fs.rm(stickFramesDir, { recursive: true, force: true });
      } catch (err) {
        console.error("Error cleaning up intermediate files:", err);
      }
    }, 5000);

    return jobId;
  } catch (error) {
    console.error("Error processing video:", error);
    
    updateStatus(jobId, {
      status: "error",
      progress: 0,
      message: "Error processing video",
      error: error instanceof Error ? error.message : String(error),
    });

    throw error;
  }
}

/**
 * Clean up old processing jobs
 */
export function cleanupOldJobs(): void {
  for (const [jobId, status] of processingJobs.entries()) {
    // Remove completed or error jobs
    if (status.status === "completed" || status.status === "error") {
      processingJobs.delete(jobId);
    }
  }
}
