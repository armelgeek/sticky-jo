/**
 * Animation Renderer
 * Renders keyframe animations to video
 */

import { promises as fs } from "fs";
import path from "path";
import { PoseKeypoints } from "@/lib/video/poseEstimation";
import { drawStickFigure } from "@/lib/video/stickFigure";
import ffmpegStatic from "fluent-ffmpeg";

const ffmpegPath = process.env.FFMPEG_PATH || "ffmpeg";
const ffprobePath = process.env.FFPROBE_PATH || "ffprobe";

ffmpegStatic.setFfmpegPath(ffmpegPath);
ffmpegStatic.setFfprobePath(ffprobePath);

const ffmpeg = ffmpegStatic;

interface AnimationJob {
  id: string;
  status: "processing" | "completed" | "error";
  progress: number;
  message: string;
  error?: string;
}

// In-memory job storage
const jobs = new Map<string, AnimationJob>();

export interface AnimationKeyframe {
  id: string;
  time: number;
  pose: PoseKeypoints;
}

/**
 * Render animation from keyframes
 */
export async function renderAnimation(
  jobId: string,
  keyframes: AnimationKeyframe[],
  duration: number,
  fps: number,
  outputDir: string
): Promise<void> {
  // Initialize job
  jobs.set(jobId, {
    id: jobId,
    status: "processing",
    progress: 0,
    message: "Starting animation rendering...",
  });

  try {
    // Create temp directory for frames
    const framesDir = path.join(outputDir, `frames-${jobId}`);
    await fs.mkdir(framesDir, { recursive: true });

    // Calculate total frames
    const totalFrames = Math.ceil((duration / 1000) * fps);
    
    updateJob(jobId, 10, "Generating frames...");

    // Generate frames
    for (let i = 0; i < totalFrames; i++) {
      const time = (i / totalFrames) * duration;
      const pose = interpolatePoseAtTime(keyframes, time);
      
      const framePath = path.join(framesDir, `frame_${String(i).padStart(4, "0")}.png`);
      await drawStickFigure(pose, framePath, {
        width: 512,
        height: 512,
        lineWidth: 3,
        color: "#000000",
        mouthOpen: false,
      });

      const progress = 10 + Math.floor((i / totalFrames) * 80);
      updateJob(jobId, progress, `Rendering frame ${i + 1}/${totalFrames}...`);
    }

    updateJob(jobId, 90, "Assembling video...");

    // Assemble video
    const outputPath = path.join(outputDir, `${jobId}.mp4`);
    await assembleFramesToVideo(framesDir, outputPath, fps);

    // Cleanup frames
    await fs.rm(framesDir, { recursive: true, force: true });

    updateJob(jobId, 100, "Animation completed!");
    jobs.get(jobId)!.status = "completed";
  } catch (error) {
    console.error("Rendering error:", error);
    const job = jobs.get(jobId)!;
    job.status = "error";
    job.error = error instanceof Error ? error.message : String(error);
    job.message = "Rendering failed";
  }
}

/**
 * Get animation job status
 */
export async function getAnimationStatus(jobId: string) {
  const job = jobs.get(jobId);
  
  if (!job) {
    return {
      id: jobId,
      status: "error" as const,
      progress: 0,
      message: "Job not found",
      error: "Job not found",
    };
  }

  return job;
}

/**
 * Update job status
 */
function updateJob(jobId: string, progress: number, message: string) {
  const job = jobs.get(jobId);
  if (job) {
    job.progress = progress;
    job.message = message;
  }
}

/**
 * Interpolate pose at specific time
 */
function interpolatePoseAtTime(
  keyframes: AnimationKeyframe[],
  time: number
): PoseKeypoints {
  // Sort keyframes by time
  const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);

  // Find surrounding keyframes
  const before = sortedKeyframes.filter(kf => kf.time <= time).pop();
  const after = sortedKeyframes.find(kf => kf.time > time);

  if (!before) return sortedKeyframes[0].pose;
  if (!after) return before.pose;

  // Calculate interpolation factor
  const t = (time - before.time) / (after.time - before.time);
  
  // Interpolate
  return interpolatePose(before.pose, after.pose, t);
}

/**
 * Interpolate between two poses
 */
function interpolatePose(
  pose1: PoseKeypoints,
  pose2: PoseKeypoints,
  t: number
): PoseKeypoints {
  const lerp = (a: number, b: number) => a + (b - a) * t;
  
  const interpolatePoint = (
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ) => ({
    x: lerp(p1.x, p2.x),
    y: lerp(p1.y, p2.y),
  });

  return {
    nose: interpolatePoint(pose1.nose, pose2.nose),
    leftShoulder: interpolatePoint(pose1.leftShoulder, pose2.leftShoulder),
    rightShoulder: interpolatePoint(pose1.rightShoulder, pose2.rightShoulder),
    leftElbow: interpolatePoint(pose1.leftElbow, pose2.leftElbow),
    rightElbow: interpolatePoint(pose1.rightElbow, pose2.rightElbow),
    leftWrist: interpolatePoint(pose1.leftWrist, pose2.leftWrist),
    rightWrist: interpolatePoint(pose1.rightWrist, pose2.rightWrist),
    leftHip: interpolatePoint(pose1.leftHip, pose2.leftHip),
    rightHip: interpolatePoint(pose1.rightHip, pose2.rightHip),
    leftKnee: interpolatePoint(pose1.leftKnee, pose2.leftKnee),
    rightKnee: interpolatePoint(pose1.rightKnee, pose2.rightKnee),
    leftAnkle: interpolatePoint(pose1.leftAnkle, pose2.leftAnkle),
    rightAnkle: interpolatePoint(pose1.rightAnkle, pose2.rightAnkle),
  };
}

/**
 * Assemble frames into video
 */
async function assembleFramesToVideo(
  framesDir: string,
  outputPath: string,
  fps: number
): Promise<void> {
  const pattern = path.join(framesDir, "frame_%04d.png");

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(pattern)
      .inputOptions([`-framerate ${fps}`])
      .outputOptions([
        "-c:v libx264",
        "-pix_fmt yuv420p",
        "-preset fast",
      ])
      .output(outputPath)
      .on("end", () => resolve())
      .on("error", reject)
      .run();
  });
}
