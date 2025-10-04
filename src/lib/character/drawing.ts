/**
 * Enhanced character drawing with body forms and expressions
 * Based on the style reference with rounded body parts and joints
 */

import { PoseKeypoints } from "@/lib/video/poseEstimation";
import { CharacterStyle, CharacterState, DEFAULT_STYLE, DEFAULT_STATE } from "./types";

interface Point {
  x: number;
  y: number;
}

// Union type to handle both browser and node-canvas contexts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCanvasRenderingContext2D = CanvasRenderingContext2D | any;

/**
 * Draw an enhanced character with body shapes
 */
export function drawEnhancedCharacter(
  ctx: AnyCanvasRenderingContext2D,
  pose: PoseKeypoints,
  width: number,
  height: number,
  style: Partial<CharacterStyle> = {},
  state: Partial<CharacterState> = {}
) {
  const s = { ...DEFAULT_STYLE, ...style };
  const st = { ...DEFAULT_STATE, ...state };

  // Apply scale and flip transformations
  ctx.save();
  ctx.translate(width / 2, height / 2);
  if (st.flip) {
    ctx.scale(-st.scale, st.scale);
  } else {
    ctx.scale(st.scale, st.scale);
  }
  ctx.translate(-width / 2, -height / 2);

  // Convert normalized coordinates to canvas coordinates
  const scale = (point: Point) => ({
    x: point.x * width,
    y: point.y * height,
  });

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

  // Calculate base sizes
  const headRadius = Math.abs(nose.y - neck.y) * 1.5 * s.headSize;
  const jointRadius = headRadius * 0.3 * s.jointSize;
  const limbWidth = headRadius * 0.4 * s.limbWidth;
  const torsoWidth = Math.abs(leftShoulder.x - rightShoulder.x) * 0.7 * s.torsoWidth;

  // Draw torso with rounded shape
  drawTorso(ctx, neck, hipCenter, torsoWidth, s);

  // Draw limbs with thickness
  drawLimb(ctx, leftShoulder, leftElbow, leftWrist, limbWidth, s);
  drawLimb(ctx, rightShoulder, rightElbow, rightWrist, limbWidth, s);
  drawLimb(ctx, leftHip, leftKnee, leftAnkle, limbWidth, s);
  drawLimb(ctx, rightHip, rightKnee, rightAnkle, limbWidth, s);

  // Draw joints as circles
  if (s.showJoints) {
    drawJoint(ctx, leftShoulder, jointRadius, s);
    drawJoint(ctx, rightShoulder, jointRadius, s);
    drawJoint(ctx, leftElbow, jointRadius, s);
    drawJoint(ctx, rightElbow, jointRadius, s);
    drawJoint(ctx, leftWrist, jointRadius * 0.8, s);
    drawJoint(ctx, rightWrist, jointRadius * 0.8, s);
    drawJoint(ctx, leftHip, jointRadius, s);
    drawJoint(ctx, rightHip, jointRadius, s);
    drawJoint(ctx, leftKnee, jointRadius, s);
    drawJoint(ctx, rightKnee, jointRadius, s);
    drawJoint(ctx, leftAnkle, jointRadius * 0.8, s);
    drawJoint(ctx, rightAnkle, jointRadius * 0.8, s);
  }

  // Draw head with neck
  drawNeck(ctx, neck, headRadius * 0.6, s);
  drawHead(ctx, nose, neck, headRadius, st, s);

  ctx.restore();
}

function drawTorso(
  ctx: AnyCanvasRenderingContext2D,
  neck: Point,
  hipCenter: Point,
  width: number,
  style: CharacterStyle
) {
  const midY = (neck.y + hipCenter.y) / 2;
  
  ctx.fillStyle = style.skinColor;
  ctx.beginPath();
  
  // Draw rounded torso shape
  ctx.ellipse(
    (neck.x + hipCenter.x) / 2,
    midY,
    width,
    Math.abs(hipCenter.y - neck.y) / 2,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  if (style.hasOutline) {
    ctx.strokeStyle = style.outlineColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawLimb(
  ctx: AnyCanvasRenderingContext2D,
  start: Point,
  mid: Point,
  end: Point,
  width: number,
  style: CharacterStyle
) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  
  // Draw upper limb
  ctx.strokeStyle = style.skinColor;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(mid.x, mid.y);
  ctx.stroke();
  
  // Draw lower limb
  ctx.beginPath();
  ctx.moveTo(mid.x, mid.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  
  // Draw outline
  if (style.hasOutline) {
    ctx.strokeStyle = style.outlineColor;
    ctx.lineWidth = width + 2;
    ctx.globalCompositeOperation = "destination-over";
    
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(mid.x, mid.y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(mid.x, mid.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    
    ctx.globalCompositeOperation = "source-over";
  }
}

function drawJoint(
  ctx: AnyCanvasRenderingContext2D,
  point: Point,
  radius: number,
  style: CharacterStyle
) {
  ctx.fillStyle = style.skinColor;
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fill();
  
  if (style.hasOutline) {
    ctx.strokeStyle = style.outlineColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawNeck(
  ctx: AnyCanvasRenderingContext2D,
  neck: Point,
  width: number,
  style: CharacterStyle
) {
  ctx.fillStyle = style.skinColor;
  ctx.fillRect(neck.x - width / 2, neck.y - width / 3, width, width / 2);
  
  if (style.hasOutline) {
    ctx.strokeStyle = style.outlineColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(neck.x - width / 2, neck.y - width / 3, width, width / 2);
  }
}

function drawHead(
  ctx: AnyCanvasRenderingContext2D,
  nose: Point,
  neck: Point,
  radius: number,
  state: CharacterState,
  style: CharacterStyle
) {
  const headCenter = {
    x: nose.x + state.headTurn * radius * 0.2,
    y: nose.y - radius / 2,
  };

  // Apply head tilt
  ctx.save();
  ctx.translate(headCenter.x, headCenter.y);
  ctx.rotate(state.headTilt * 0.3); // Max 17 degrees tilt
  ctx.translate(-headCenter.x, -headCenter.y);

  // Draw head circle
  ctx.fillStyle = style.skinColor;
  ctx.beginPath();
  ctx.arc(headCenter.x, headCenter.y, radius, 0, Math.PI * 2);
  ctx.fill();
  
  if (style.hasOutline) {
    ctx.strokeStyle = style.outlineColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Draw face features
  drawFace(ctx, headCenter, radius, state, style);

  ctx.restore();
}

function drawFace(
  ctx: AnyCanvasRenderingContext2D,
  center: Point,
  radius: number,
  state: CharacterState,
  style: CharacterStyle
) {
  const eyeY = center.y - radius / 4;
  const eyeOffset = radius / 3;
  const eyeSize = state.eyesOpen ? 3 : 1;

  ctx.fillStyle = style.eyeColor;

  // Draw eyes based on expression
  if (state.eyeExpression === "happy") {
    // Happy eyes (curved)
    ctx.beginPath();
    ctx.arc(center.x - eyeOffset, eyeY, radius / 8, 0.2, Math.PI - 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(center.x + eyeOffset, eyeY, radius / 8, 0.2, Math.PI - 0.2);
    ctx.stroke();
  } else if (state.eyeExpression === "angry") {
    // Angry eyes (slanted down)
    ctx.strokeStyle = style.eyeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(center.x - eyeOffset - 5, eyeY - 3);
    ctx.lineTo(center.x - eyeOffset + 5, eyeY + 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(center.x + eyeOffset - 5, eyeY + 3);
    ctx.lineTo(center.x + eyeOffset + 5, eyeY - 3);
    ctx.stroke();
  } else if (state.eyeExpression === "shocked" || state.eyeExpression === "sad") {
    // Wide open eyes
    ctx.beginPath();
    ctx.arc(center.x - eyeOffset, eyeY, radius / 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(center.x + eyeOffset, eyeY, radius / 10, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Normal eyes
    if (state.eyesOpen) {
      ctx.beginPath();
      ctx.arc(center.x - eyeOffset, eyeY, eyeSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(center.x + eyeOffset, eyeY, eyeSize, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Blinking - draw lines
      ctx.strokeStyle = style.eyeColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(center.x - eyeOffset - 3, eyeY);
      ctx.lineTo(center.x - eyeOffset + 3, eyeY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(center.x + eyeOffset - 3, eyeY);
      ctx.lineTo(center.x + eyeOffset + 3, eyeY);
      ctx.stroke();
    }
  }

  // Draw mouth based on expression
  const mouthY = center.y + radius / 3;
  ctx.strokeStyle = style.outlineColor;
  ctx.lineWidth = 2;
  
  ctx.beginPath();
  if (state.mouthExpression === "smile") {
    // Smile
    ctx.arc(center.x, mouthY - radius / 8, radius / 3, 0.2, Math.PI - 0.2);
  } else if (state.mouthExpression === "frown") {
    // Frown
    ctx.arc(center.x, mouthY + radius / 4, radius / 3, Math.PI + 0.2, Math.PI * 2 - 0.2, true);
  } else if (state.mouthExpression === "surprised") {
    // Open mouth (O shape)
    ctx.arc(center.x, mouthY, radius / 5, 0, Math.PI * 2);
  } else if (state.mouthExpression === "angry") {
    // Straight line
    ctx.moveTo(center.x - radius / 4, mouthY);
    ctx.lineTo(center.x + radius / 4, mouthY);
  } else {
    // Neutral
    if (state.mouthOpen) {
      ctx.ellipse(center.x, mouthY, radius / 4, radius / 6, 0, 0, Math.PI * 2);
    } else {
      ctx.moveTo(center.x - radius / 4, mouthY);
      ctx.lineTo(center.x + radius / 4, mouthY);
    }
  }
  ctx.stroke();
}
