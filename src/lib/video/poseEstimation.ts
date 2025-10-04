/**
 * Pose estimation using MediaPipe
 * Detects body keypoints for stick figure generation
 */

import { PoseLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { promises as fs } from "fs";
import { createCanvas, loadImage, Image } from "canvas";

// Polyfill for document object in Node.js environment
// MediaPipe requires a document global for certain operations
if (typeof document === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).document = {
    createElement: () => ({
      getContext: () => null,
    }),
    createElementNS: () => ({}),
    documentElement: {
      style: {},
    },
  };
}

export interface PoseKeypoints {
  nose: { x: number; y: number };
  leftShoulder: { x: number; y: number };
  rightShoulder: { x: number; y: number };
  leftElbow: { x: number; y: number };
  rightElbow: { x: number; y: number };
  leftWrist: { x: number; y: number };
  rightWrist: { x: number; y: number };
  leftHip: { x: number; y: number };
  rightHip: { x: number; y: number };
  leftKnee: { x: number; y: number };
  rightKnee: { x: number; y: number };
  leftAnkle: { x: number; y: number };
  rightAnkle: { x: number; y: number };
}

let poseLandmarker: PoseLandmarker | null = null;

/**
 * Initialize MediaPipe Pose Landmarker
 */
export async function initializePoseLandmarker(): Promise<void> {
  if (poseLandmarker) return;

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
      delegate: "CPU",
    },
    runningMode: "IMAGE",
    numPoses: 1,
  });
}

/**
 * Extract pose keypoints from an image file
 */
export async function extractPoseFromImage(
  imagePath: string
): Promise<PoseKeypoints | null> {
  try {
    if (!poseLandmarker) {
      await initializePoseLandmarker();
    }

    const imageBuffer = await fs.readFile(imagePath);
    const image = await loadImage(imageBuffer);
    
    // Create canvas to get ImageData
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image as unknown as Image, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Convert ImageData to HTMLImageElement-like object for MediaPipe
    const htmlImage = {
      width: canvas.width,
      height: canvas.height,
      data: imageData.data,
    };

    const result = poseLandmarker!.detect(htmlImage as unknown as HTMLImageElement);

    if (!result.landmarks || result.landmarks.length === 0) {
      return null;
    }

    const landmarks = result.landmarks[0];
    
    // MediaPipe pose landmark indices
    // 0: nose, 11: left shoulder, 12: right shoulder
    // 13: left elbow, 14: right elbow, 15: left wrist, 16: right wrist
    // 23: left hip, 24: right hip, 25: left knee, 26: right knee
    // 27: left ankle, 28: right ankle

    return {
      nose: { x: landmarks[0].x, y: landmarks[0].y },
      leftShoulder: { x: landmarks[11].x, y: landmarks[11].y },
      rightShoulder: { x: landmarks[12].x, y: landmarks[12].y },
      leftElbow: { x: landmarks[13].x, y: landmarks[13].y },
      rightElbow: { x: landmarks[14].x, y: landmarks[14].y },
      leftWrist: { x: landmarks[15].x, y: landmarks[15].y },
      rightWrist: { x: landmarks[16].x, y: landmarks[16].y },
      leftHip: { x: landmarks[23].x, y: landmarks[23].y },
      rightHip: { x: landmarks[24].x, y: landmarks[24].y },
      leftKnee: { x: landmarks[25].x, y: landmarks[25].y },
      rightKnee: { x: landmarks[26].x, y: landmarks[26].y },
      leftAnkle: { x: landmarks[27].x, y: landmarks[27].y },
      rightAnkle: { x: landmarks[28].x, y: landmarks[28].y },
    };
  } catch (error) {
    console.error("Error extracting pose:", error);
    return null;
  }
}
