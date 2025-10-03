/**
 * FFmpeg utilities for video processing
 * Handles frame extraction, audio extraction, and video assembly
 */

import ffmpegStatic from "fluent-ffmpeg";
import { promises as fs } from "fs";
import path from "path";

// Configure FFmpeg paths
const ffmpegPath = process.env.FFMPEG_PATH || "ffmpeg";
const ffprobePath = process.env.FFPROBE_PATH || "ffprobe";

ffmpegStatic.setFfmpegPath(ffmpegPath);
ffmpegStatic.setFfprobePath(ffprobePath);

const ffmpeg = ffmpegStatic;

export interface VideoMetadata {
  duration: number;
  fps: number;
  width: number;
  height: number;
}

/**
 * Extract frames from video at specified FPS
 */
export async function extractFrames(
  videoPath: string,
  outputDir: string,
  fps: number = 10
): Promise<string[]> {
  await fs.mkdir(outputDir, { recursive: true });

  return new Promise((resolve, reject) => {
    const pattern = path.join(outputDir, "frame_%04d.png");

    ffmpeg(videoPath)
      .outputOptions([`-vf fps=${fps}`])
      .output(pattern)
      .on("end", async () => {
        try {
          const files = await fs.readdir(outputDir);
          const frameFiles = files
            .filter((f) => f.startsWith("frame_") && f.endsWith(".png"))
            .sort()
            .map((f) => path.join(outputDir, f));
          resolve(frameFiles);
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject)
      .run();
  });
}

/**
 * Extract audio from video
 */
export async function extractAudio(
  videoPath: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(outputPath)
      .noVideo()
      .audioCodec("aac")
      .on("end", () => resolve())
      .on("error", reject)
      .run();
  });
}

/**
 * Get video metadata
 */
export async function getVideoMetadata(
  videoPath: string
): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const videoStream = metadata.streams.find((s) => s.codec_type === "video");
      if (!videoStream) {
        reject(new Error("No video stream found"));
        return;
      }

      const fps = eval(videoStream.r_frame_rate || "30/1") as number;
      
      resolve({
        duration: metadata.format.duration || 0,
        fps: fps,
        width: videoStream.width || 512,
        height: videoStream.height || 512,
      });
    });
  });
}

/**
 * Assemble frames and audio into final video
 */
export async function assembleVideo(
  framesDir: string,
  audioPath: string,
  outputPath: string,
  fps: number = 10
): Promise<void> {
  const pattern = path.join(framesDir, "frame_%04d.png");

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(pattern)
      .inputOptions([`-framerate ${fps}`])
      .input(audioPath)
      .outputOptions([
        "-c:v libx264",
        "-pix_fmt yuv420p",
        "-c:a aac",
        "-shortest",
      ])
      .output(outputPath)
      .on("end", () => resolve())
      .on("error", reject)
      .run();
  });
}
