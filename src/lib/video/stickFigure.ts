/**
 * Stick figure drawing on canvas
 * Draws simplified stick figures on white background
 */

import { createCanvas } from "canvas";
import { promises as fs } from "fs";
import { PoseKeypoints } from "./poseEstimation";

export interface DrawOptions {
  width: number;
  height: number;
  lineWidth: number;
  color: string;
  mouthOpen: boolean;
}

const DEFAULT_OPTIONS: DrawOptions = {
  width: 512,
  height: 512,
  lineWidth: 3,
  color: "#000000",
  mouthOpen: false,
};

/**
 * Draw a stick figure based on pose keypoints
 */
export async function drawStickFigure(
  keypoints: PoseKeypoints,
  outputPath: string,
  options: Partial<DrawOptions> = {}
): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const canvas = createCanvas(opts.width, opts.height);
  const ctx = canvas.getContext("2d");

  // Fill white background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, opts.width, opts.height);

  // Set drawing style
  ctx.strokeStyle = opts.color;
  ctx.lineWidth = opts.lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Convert normalized coordinates to canvas coordinates
  const scale = (point: { x: number; y: number }) => ({
    x: point.x * opts.width,
    y: point.y * opts.height,
  });

  const nose = scale(keypoints.nose);
  const leftShoulder = scale(keypoints.leftShoulder);
  const rightShoulder = scale(keypoints.rightShoulder);
  const leftElbow = scale(keypoints.leftElbow);
  const rightElbow = scale(keypoints.rightElbow);
  const leftWrist = scale(keypoints.leftWrist);
  const rightWrist = scale(keypoints.rightWrist);
  const leftHip = scale(keypoints.leftHip);
  const rightHip = scale(keypoints.rightHip);
  const leftKnee = scale(keypoints.leftKnee);
  const rightKnee = scale(keypoints.rightKnee);
  const leftAnkle = scale(keypoints.leftAnkle);
  const rightAnkle = scale(keypoints.rightAnkle);

  // Calculate neck position (midpoint between shoulders)
  const neck = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2,
  };

  // Calculate hip center
  const hipCenter = {
    x: (leftHip.x + rightHip.x) / 2,
    y: (leftHip.y + rightHip.y) / 2,
  };

  // Draw head (circle)
  const headRadius = Math.abs(nose.y - neck.y) * 1.5;
  ctx.beginPath();
  ctx.arc(nose.x, nose.y - headRadius / 2, headRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Draw face features
  const eyeY = nose.y - headRadius / 2 - headRadius / 4;
  const eyeOffset = headRadius / 3;

  // Eyes
  ctx.fillStyle = opts.color;
  ctx.beginPath();
  ctx.arc(nose.x - eyeOffset, eyeY, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(nose.x + eyeOffset, eyeY, 2, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  const mouthY = nose.y - headRadius / 2 + headRadius / 3;
  ctx.beginPath();
  if (opts.mouthOpen) {
    // Open mouth (oval)
    ctx.ellipse(nose.x, mouthY, headRadius / 4, headRadius / 6, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    // Closed mouth (smile line)
    ctx.arc(nose.x, mouthY - headRadius / 8, headRadius / 3, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }

  // Draw torso (neck to hip center)
  ctx.beginPath();
  ctx.moveTo(neck.x, neck.y);
  ctx.lineTo(hipCenter.x, hipCenter.y);
  ctx.stroke();

  // Draw shoulders line
  ctx.beginPath();
  ctx.moveTo(leftShoulder.x, leftShoulder.y);
  ctx.lineTo(rightShoulder.x, rightShoulder.y);
  ctx.stroke();

  // Draw left arm
  ctx.beginPath();
  ctx.moveTo(leftShoulder.x, leftShoulder.y);
  ctx.lineTo(leftElbow.x, leftElbow.y);
  ctx.lineTo(leftWrist.x, leftWrist.y);
  ctx.stroke();

  // Draw right arm
  ctx.beginPath();
  ctx.moveTo(rightShoulder.x, rightShoulder.y);
  ctx.lineTo(rightElbow.x, rightElbow.y);
  ctx.lineTo(rightWrist.x, rightWrist.y);
  ctx.stroke();

  // Draw hip line
  ctx.beginPath();
  ctx.moveTo(leftHip.x, leftHip.y);
  ctx.lineTo(rightHip.x, rightHip.y);
  ctx.stroke();

  // Draw left leg
  ctx.beginPath();
  ctx.moveTo(leftHip.x, leftHip.y);
  ctx.lineTo(leftKnee.x, leftKnee.y);
  ctx.lineTo(leftAnkle.x, leftAnkle.y);
  ctx.stroke();

  // Draw right leg
  ctx.beginPath();
  ctx.moveTo(rightHip.x, rightHip.y);
  ctx.lineTo(rightKnee.x, rightKnee.y);
  ctx.lineTo(rightAnkle.x, rightAnkle.y);
  ctx.stroke();

  // Save to file
  const buffer = canvas.toBuffer("image/png");
  await fs.writeFile(outputPath, buffer);
}
