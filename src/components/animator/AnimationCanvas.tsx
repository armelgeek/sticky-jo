"use client";

import { useEffect, useRef, useState } from "react";
import { PoseKeypoints } from "@/lib/video/poseEstimation";
import { drawEnhancedCharacter } from "@/lib/character/drawing";
import { CharacterStyle, CharacterState } from "@/lib/character/types";

interface AnimationCanvasProps {
  pose: PoseKeypoints | null;
  onPoseChange?: (pose: PoseKeypoints) => void;
  isEditable?: boolean;
  characterStyle?: Partial<CharacterStyle>;
  characterState?: Partial<CharacterState>;
}

export default function AnimationCanvas({ 
  pose, 
  onPoseChange,
  isEditable = false,
  characterStyle = {},
  characterState = {}
}: AnimationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draggingPoint, setDraggingPoint] = useState<keyof PoseKeypoints | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !pose) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw enhanced stick figure
    drawEnhancedCharacter(ctx, pose, canvas.width, canvas.height, characterStyle, characterState);

    // Draw control points if editable
    if (isEditable) {
      drawControlPoints(ctx, pose, canvas.width, canvas.height);
    }
  }, [pose, isEditable, characterStyle, characterState]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isEditable || !pose) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / canvas.width;
    const y = (e.clientY - rect.top) / canvas.height;

    // Find closest control point
    const threshold = 0.03;
    for (const [key, point] of Object.entries(pose) as [keyof PoseKeypoints, { x: number; y: number }][]) {
      const dx = point.x - x;
      const dy = point.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < threshold) {
        setDraggingPoint(key);
        break;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingPoint || !pose || !onPoseChange) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / canvas.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / canvas.height));

    const newPose = {
      ...pose,
      [draggingPoint]: { x, y },
    };

    onPoseChange(newPose);
  };

  const handleMouseUp = () => {
    setDraggingPoint(null);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={512}
        height={512}
        className="border border-gray-600 rounded-lg shadow-xl cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      {!pose && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 rounded-lg">
          <p className="text-gray-400">Add a keyframe to start animating</p>
        </div>
      )}
    </div>
  );
}

// Keep the old simple drawing for reference, but not used anymore
/* function drawStickFigure(
  ctx: CanvasRenderingContext2D,
  pose: PoseKeypoints,
  width: number,
  height: number
) {
  const scale = (point: { x: number; y: number }) => ({
    x: point.x * width,
    y: point.y * height,
  });

  // Set drawing style
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const nose = scale(pose.nose);
  const leftShoulder = scale(pose.leftShoulder);
  const rightShoulder = scale(pose.rightShoulder);
  const leftElbow = scale(pose.leftElbow);
  const rightElbow = scale(pose.rightElbow);
  const leftWrist = scale(pose.leftWrist);
  const rightWrist = scale(pose.rightWrist);
  const leftHip = scale(pose.leftHip);
  const rightHip = scale(pose.rightHip);
  const leftKnee = scale(pose.leftKnee);
  const rightKnee = scale(pose.rightKnee);
  const leftAnkle = scale(pose.leftAnkle);
  const rightAnkle = scale(pose.rightAnkle);

  // Calculate neck and hip center
  const neck = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2,
  };

  const hipCenter = {
    x: (leftHip.x + rightHip.x) / 2,
    y: (leftHip.y + rightHip.y) / 2,
  };

  // Draw head
  const headRadius = Math.abs(nose.y - neck.y) * 1.5;
  ctx.beginPath();
  ctx.arc(nose.x, nose.y - headRadius / 2, headRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Draw face
  const eyeY = nose.y - headRadius / 2 - headRadius / 4;
  const eyeOffset = headRadius / 3;
  
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(nose.x - eyeOffset, eyeY, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(nose.x + eyeOffset, eyeY, 2, 0, Math.PI * 2);
  ctx.fill();

  const mouthY = nose.y - headRadius / 2 + headRadius / 3;
  ctx.beginPath();
  ctx.arc(nose.x, mouthY - headRadius / 8, headRadius / 3, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Draw body
  ctx.beginPath();
  ctx.moveTo(neck.x, neck.y);
  ctx.lineTo(hipCenter.x, hipCenter.y);
  ctx.stroke();

  // Draw shoulders
  ctx.beginPath();
  ctx.moveTo(leftShoulder.x, leftShoulder.y);
  ctx.lineTo(rightShoulder.x, rightShoulder.y);
  ctx.stroke();

  // Draw arms
  ctx.beginPath();
  ctx.moveTo(leftShoulder.x, leftShoulder.y);
  ctx.lineTo(leftElbow.x, leftElbow.y);
  ctx.lineTo(leftWrist.x, leftWrist.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(rightShoulder.x, rightShoulder.y);
  ctx.lineTo(rightElbow.x, rightElbow.y);
  ctx.lineTo(rightWrist.x, rightWrist.y);
  ctx.stroke();

  // Draw hips
  ctx.beginPath();
  ctx.moveTo(leftHip.x, leftHip.y);
  ctx.lineTo(rightHip.x, rightHip.y);
  ctx.stroke();

  // Draw legs
  ctx.beginPath();
  ctx.moveTo(leftHip.x, leftHip.y);
  ctx.lineTo(leftKnee.x, leftKnee.y);
  ctx.lineTo(leftAnkle.x, leftAnkle.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(rightHip.x, rightHip.y);
  ctx.lineTo(rightKnee.x, rightKnee.y);
  ctx.lineTo(rightAnkle.x, rightAnkle.y);
  ctx.stroke();
}
*/

function drawControlPoints(
  ctx: CanvasRenderingContext2D,
  pose: PoseKeypoints,
  width: number,
  height: number
) {
  ctx.fillStyle = "#3B82F6";
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 2;

  for (const point of Object.values(pose)) {
    const x = point.x * width;
    const y = point.y * height;
    
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}
