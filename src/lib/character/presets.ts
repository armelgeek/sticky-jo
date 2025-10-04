/**
 * Animation presets library
 * Pre-defined animations that can be applied to characters
 */

import { PoseKeypoints } from "@/lib/video/poseEstimation";
import { AnimationFrame, CharacterState, DEFAULT_STATE } from "./types";

// Helper function to create a T-pose
function createTPose(): PoseKeypoints {
  return {
    nose: { x: 0.5, y: 0.2 },
    leftShoulder: { x: 0.35, y: 0.35 },
    rightShoulder: { x: 0.65, y: 0.35 },
    leftElbow: { x: 0.2, y: 0.35 },
    rightElbow: { x: 0.8, y: 0.35 },
    leftWrist: { x: 0.1, y: 0.35 },
    rightWrist: { x: 0.9, y: 0.35 },
    leftHip: { x: 0.4, y: 0.6 },
    rightHip: { x: 0.6, y: 0.6 },
    leftKnee: { x: 0.4, y: 0.75 },
    rightKnee: { x: 0.6, y: 0.75 },
    leftAnkle: { x: 0.4, y: 0.9 },
    rightAnkle: { x: 0.6, y: 0.9 },
  };
}

// Walking cycle animation (8 frames)
export function getWalkingCycleAnimation(): AnimationFrame[] {
  const baseState: CharacterState = {
    ...DEFAULT_STATE,
    eyeExpression: "normal",
    mouthExpression: "neutral",
  };

  return [
    {
      pose: {
        nose: { x: 0.5, y: 0.2 },
        leftShoulder: { x: 0.4, y: 0.35 },
        rightShoulder: { x: 0.6, y: 0.35 },
        leftElbow: { x: 0.35, y: 0.45 },
        rightElbow: { x: 0.65, y: 0.5 },
        leftWrist: { x: 0.3, y: 0.55 },
        rightWrist: { x: 0.7, y: 0.6 },
        leftHip: { x: 0.42, y: 0.6 },
        rightHip: { x: 0.58, y: 0.6 },
        leftKnee: { x: 0.42, y: 0.75 },
        rightKnee: { x: 0.58, y: 0.7 },
        leftAnkle: { x: 0.42, y: 0.9 },
        rightAnkle: { x: 0.58, y: 0.82 },
      },
      state: baseState,
    },
    {
      pose: {
        nose: { x: 0.5, y: 0.19 },
        leftShoulder: { x: 0.4, y: 0.35 },
        rightShoulder: { x: 0.6, y: 0.35 },
        leftElbow: { x: 0.35, y: 0.5 },
        rightElbow: { x: 0.65, y: 0.45 },
        leftWrist: { x: 0.3, y: 0.6 },
        rightWrist: { x: 0.7, y: 0.55 },
        leftHip: { x: 0.42, y: 0.6 },
        rightHip: { x: 0.58, y: 0.6 },
        leftKnee: { x: 0.42, y: 0.72 },
        rightKnee: { x: 0.58, y: 0.68 },
        leftAnkle: { x: 0.42, y: 0.85 },
        rightAnkle: { x: 0.58, y: 0.78 },
      },
      state: baseState,
    },
    {
      pose: {
        nose: { x: 0.5, y: 0.2 },
        leftShoulder: { x: 0.4, y: 0.35 },
        rightShoulder: { x: 0.6, y: 0.35 },
        leftElbow: { x: 0.35, y: 0.5 },
        rightElbow: { x: 0.65, y: 0.45 },
        leftWrist: { x: 0.3, y: 0.6 },
        rightWrist: { x: 0.7, y: 0.55 },
        leftHip: { x: 0.42, y: 0.6 },
        rightHip: { x: 0.58, y: 0.6 },
        leftKnee: { x: 0.42, y: 0.7 },
        rightKnee: { x: 0.58, y: 0.75 },
        leftAnkle: { x: 0.42, y: 0.82 },
        rightAnkle: { x: 0.58, y: 0.9 },
      },
      state: baseState,
    },
    {
      pose: {
        nose: { x: 0.5, y: 0.19 },
        leftShoulder: { x: 0.4, y: 0.35 },
        rightShoulder: { x: 0.6, y: 0.35 },
        leftElbow: { x: 0.35, y: 0.45 },
        rightElbow: { x: 0.65, y: 0.5 },
        leftWrist: { x: 0.3, y: 0.55 },
        rightWrist: { x: 0.7, y: 0.6 },
        leftHip: { x: 0.42, y: 0.6 },
        rightHip: { x: 0.58, y: 0.6 },
        leftKnee: { x: 0.42, y: 0.68 },
        rightKnee: { x: 0.58, y: 0.72 },
        leftAnkle: { x: 0.42, y: 0.78 },
        rightAnkle: { x: 0.58, y: 0.85 },
      },
      state: baseState,
    },
    // Mirror frames for other leg
    {
      pose: {
        nose: { x: 0.5, y: 0.2 },
        leftShoulder: { x: 0.4, y: 0.35 },
        rightShoulder: { x: 0.6, y: 0.35 },
        leftElbow: { x: 0.35, y: 0.5 },
        rightElbow: { x: 0.65, y: 0.45 },
        leftWrist: { x: 0.3, y: 0.6 },
        rightWrist: { x: 0.7, y: 0.55 },
        leftHip: { x: 0.42, y: 0.6 },
        rightHip: { x: 0.58, y: 0.6 },
        leftKnee: { x: 0.42, y: 0.7 },
        rightKnee: { x: 0.58, y: 0.75 },
        leftAnkle: { x: 0.42, y: 0.82 },
        rightAnkle: { x: 0.58, y: 0.9 },
      },
      state: baseState,
    },
    {
      pose: {
        nose: { x: 0.5, y: 0.19 },
        leftShoulder: { x: 0.4, y: 0.35 },
        rightShoulder: { x: 0.6, y: 0.35 },
        leftElbow: { x: 0.35, y: 0.45 },
        rightElbow: { x: 0.65, y: 0.5 },
        leftWrist: { x: 0.3, y: 0.55 },
        rightWrist: { x: 0.7, y: 0.6 },
        leftHip: { x: 0.42, y: 0.6 },
        rightHip: { x: 0.58, y: 0.6 },
        leftKnee: { x: 0.42, y: 0.68 },
        rightKnee: { x: 0.58, y: 0.72 },
        leftAnkle: { x: 0.42, y: 0.78 },
        rightAnkle: { x: 0.58, y: 0.85 },
      },
      state: baseState,
    },
    {
      pose: {
        nose: { x: 0.5, y: 0.2 },
        leftShoulder: { x: 0.4, y: 0.35 },
        rightShoulder: { x: 0.6, y: 0.35 },
        leftElbow: { x: 0.35, y: 0.5 },
        rightElbow: { x: 0.65, y: 0.45 },
        leftWrist: { x: 0.3, y: 0.6 },
        rightWrist: { x: 0.7, y: 0.55 },
        leftHip: { x: 0.42, y: 0.6 },
        rightHip: { x: 0.58, y: 0.6 },
        leftKnee: { x: 0.42, y: 0.75 },
        rightKnee: { x: 0.58, y: 0.7 },
        leftAnkle: { x: 0.42, y: 0.9 },
        rightAnkle: { x: 0.58, y: 0.82 },
      },
      state: baseState,
    },
    {
      pose: {
        nose: { x: 0.5, y: 0.19 },
        leftShoulder: { x: 0.4, y: 0.35 },
        rightShoulder: { x: 0.6, y: 0.35 },
        leftElbow: { x: 0.35, y: 0.45 },
        rightElbow: { x: 0.65, y: 0.5 },
        leftWrist: { x: 0.3, y: 0.55 },
        rightWrist: { x: 0.7, y: 0.6 },
        leftHip: { x: 0.42, y: 0.6 },
        rightHip: { x: 0.58, y: 0.6 },
        leftKnee: { x: 0.42, y: 0.72 },
        rightKnee: { x: 0.58, y: 0.68 },
        leftAnkle: { x: 0.42, y: 0.85 },
        rightAnkle: { x: 0.58, y: 0.78 },
      },
      state: baseState,
    },
  ];
}

// Jump animation (6 frames)
export function getJumpAnimation(): AnimationFrame[] {
  return [
    {
      pose: createTPose(),
      state: { ...DEFAULT_STATE, mouthExpression: "neutral" },
    },
    {
      pose: {
        nose: { x: 0.5, y: 0.22 },
        leftShoulder: { x: 0.4, y: 0.37 },
        rightShoulder: { x: 0.6, y: 0.37 },
        leftElbow: { x: 0.35, y: 0.47 },
        rightElbow: { x: 0.65, y: 0.47 },
        leftWrist: { x: 0.3, y: 0.57 },
        rightWrist: { x: 0.7, y: 0.57 },
        leftHip: { x: 0.42, y: 0.62 },
        rightHip: { x: 0.58, y: 0.62 },
        leftKnee: { x: 0.42, y: 0.7 },
        rightKnee: { x: 0.58, y: 0.7 },
        leftAnkle: { x: 0.42, y: 0.78 },
        rightAnkle: { x: 0.58, y: 0.78 },
      },
      state: { ...DEFAULT_STATE, mouthExpression: "neutral" },
    },
    {
      pose: {
        nose: { x: 0.5, y: 0.15 },
        leftShoulder: { x: 0.4, y: 0.3 },
        rightShoulder: { x: 0.6, y: 0.3 },
        leftElbow: { x: 0.35, y: 0.25 },
        rightElbow: { x: 0.65, y: 0.25 },
        leftWrist: { x: 0.3, y: 0.22 },
        rightWrist: { x: 0.7, y: 0.22 },
        leftHip: { x: 0.42, y: 0.55 },
        rightHip: { x: 0.58, y: 0.55 },
        leftKnee: { x: 0.42, y: 0.65 },
        rightKnee: { x: 0.58, y: 0.65 },
        leftAnkle: { x: 0.42, y: 0.73 },
        rightAnkle: { x: 0.58, y: 0.73 },
      },
      state: { ...DEFAULT_STATE, mouthExpression: "surprised", eyeExpression: "happy" },
    },
    {
      pose: {
        nose: { x: 0.5, y: 0.12 },
        leftShoulder: { x: 0.4, y: 0.27 },
        rightShoulder: { x: 0.6, y: 0.27 },
        leftElbow: { x: 0.35, y: 0.22 },
        rightElbow: { x: 0.65, y: 0.22 },
        leftWrist: { x: 0.3, y: 0.19 },
        rightWrist: { x: 0.7, y: 0.19 },
        leftHip: { x: 0.42, y: 0.52 },
        rightHip: { x: 0.58, y: 0.52 },
        leftKnee: { x: 0.42, y: 0.62 },
        rightKnee: { x: 0.58, y: 0.62 },
        leftAnkle: { x: 0.42, y: 0.7 },
        rightAnkle: { x: 0.58, y: 0.7 },
      },
      state: { ...DEFAULT_STATE, mouthExpression: "surprised", eyeExpression: "happy" },
    },
    {
      pose: {
        nose: { x: 0.5, y: 0.18 },
        leftShoulder: { x: 0.4, y: 0.33 },
        rightShoulder: { x: 0.6, y: 0.33 },
        leftElbow: { x: 0.35, y: 0.28 },
        rightElbow: { x: 0.65, y: 0.28 },
        leftWrist: { x: 0.3, y: 0.25 },
        rightWrist: { x: 0.7, y: 0.25 },
        leftHip: { x: 0.42, y: 0.58 },
        rightHip: { x: 0.58, y: 0.58 },
        leftKnee: { x: 0.42, y: 0.73 },
        rightKnee: { x: 0.58, y: 0.73 },
        leftAnkle: { x: 0.42, y: 0.88 },
        rightAnkle: { x: 0.58, y: 0.88 },
      },
      state: { ...DEFAULT_STATE, mouthExpression: "neutral" },
    },
    {
      pose: createTPose(),
      state: { ...DEFAULT_STATE, mouthExpression: "smile" },
    },
  ];
}

// Happy expression
export function getHappyAnimation(): AnimationFrame[] {
  const happyPose = createTPose();
  return [
    {
      pose: happyPose,
      state: {
        ...DEFAULT_STATE,
        eyeExpression: "happy",
        mouthExpression: "smile",
      },
    },
  ];
}

// Sad expression
export function getSadAnimation(): AnimationFrame[] {
  const sadPose = {
    ...createTPose(),
    nose: { x: 0.5, y: 0.22 },
    leftShoulder: { x: 0.4, y: 0.37 },
    rightShoulder: { x: 0.6, y: 0.37 },
  };
  return [
    {
      pose: sadPose,
      state: {
        ...DEFAULT_STATE,
        eyeExpression: "sad",
        mouthExpression: "frown",
        headTilt: -0.2,
      },
    },
  ];
}

// Angry expression
export function getAngryAnimation(): AnimationFrame[] {
  return [
    {
      pose: createTPose(),
      state: {
        ...DEFAULT_STATE,
        eyeExpression: "angry",
        mouthExpression: "angry",
      },
    },
  ];
}

// Shocked expression
export function getShockedAnimation(): AnimationFrame[] {
  return [
    {
      pose: {
        nose: { x: 0.5, y: 0.2 },
        leftShoulder: { x: 0.38, y: 0.35 },
        rightShoulder: { x: 0.62, y: 0.35 },
        leftElbow: { x: 0.33, y: 0.3 },
        rightElbow: { x: 0.67, y: 0.3 },
        leftWrist: { x: 0.28, y: 0.28 },
        rightWrist: { x: 0.72, y: 0.28 },
        leftHip: { x: 0.4, y: 0.6 },
        rightHip: { x: 0.6, y: 0.6 },
        leftKnee: { x: 0.4, y: 0.75 },
        rightKnee: { x: 0.6, y: 0.75 },
        leftAnkle: { x: 0.4, y: 0.9 },
        rightAnkle: { x: 0.6, y: 0.9 },
      },
      state: {
        ...DEFAULT_STATE,
        eyeExpression: "shocked",
        mouthExpression: "surprised",
      },
    },
  ];
}

// Sleeping
export function getSleepingAnimation(): AnimationFrame[] {
  return [
    {
      pose: {
        nose: { x: 0.5, y: 0.25 },
        leftShoulder: { x: 0.4, y: 0.4 },
        rightShoulder: { x: 0.6, y: 0.4 },
        leftElbow: { x: 0.35, y: 0.5 },
        rightElbow: { x: 0.65, y: 0.5 },
        leftWrist: { x: 0.3, y: 0.6 },
        rightWrist: { x: 0.7, y: 0.6 },
        leftHip: { x: 0.4, y: 0.65 },
        rightHip: { x: 0.6, y: 0.65 },
        leftKnee: { x: 0.4, y: 0.8 },
        rightKnee: { x: 0.6, y: 0.8 },
        leftAnkle: { x: 0.4, y: 0.9 },
        rightAnkle: { x: 0.6, y: 0.9 },
      },
      state: {
        ...DEFAULT_STATE,
        eyesOpen: false,
        mouthExpression: "neutral",
        headTilt: 0.3,
      },
    },
  ];
}

// Punch animation
export function getPunchAnimation(): AnimationFrame[] {
  return [
    {
      pose: createTPose(),
      state: { ...DEFAULT_STATE, mouthExpression: "neutral" },
    },
    {
      pose: {
        nose: { x: 0.5, y: 0.2 },
        leftShoulder: { x: 0.4, y: 0.35 },
        rightShoulder: { x: 0.6, y: 0.35 },
        leftElbow: { x: 0.35, y: 0.4 },
        rightElbow: { x: 0.65, y: 0.4 },
        leftWrist: { x: 0.3, y: 0.45 },
        rightWrist: { x: 0.75, y: 0.35 },
        leftHip: { x: 0.4, y: 0.6 },
        rightHip: { x: 0.6, y: 0.6 },
        leftKnee: { x: 0.4, y: 0.75 },
        rightKnee: { x: 0.6, y: 0.75 },
        leftAnkle: { x: 0.4, y: 0.9 },
        rightAnkle: { x: 0.6, y: 0.9 },
      },
      state: { ...DEFAULT_STATE, eyeExpression: "angry", mouthExpression: "angry" },
    },
    {
      pose: createTPose(),
      state: { ...DEFAULT_STATE, mouthExpression: "smile" },
    },
  ];
}

// Winner pose
export function getWinnerAnimation(): AnimationFrame[] {
  return [
    {
      pose: {
        nose: { x: 0.5, y: 0.2 },
        leftShoulder: { x: 0.4, y: 0.35 },
        rightShoulder: { x: 0.6, y: 0.35 },
        leftElbow: { x: 0.35, y: 0.25 },
        rightElbow: { x: 0.65, y: 0.25 },
        leftWrist: { x: 0.3, y: 0.18 },
        rightWrist: { x: 0.7, y: 0.18 },
        leftHip: { x: 0.4, y: 0.6 },
        rightHip: { x: 0.6, y: 0.6 },
        leftKnee: { x: 0.4, y: 0.75 },
        rightKnee: { x: 0.6, y: 0.75 },
        leftAnkle: { x: 0.4, y: 0.9 },
        rightAnkle: { x: 0.6, y: 0.9 },
      },
      state: {
        ...DEFAULT_STATE,
        eyeExpression: "happy",
        mouthExpression: "smile",
      },
    },
  ];
}

// Phone usage
export function getPhoneAnimation(): AnimationFrame[] {
  return [
    {
      pose: {
        nose: { x: 0.5, y: 0.2 },
        leftShoulder: { x: 0.4, y: 0.35 },
        rightShoulder: { x: 0.6, y: 0.35 },
        leftElbow: { x: 0.35, y: 0.45 },
        rightElbow: { x: 0.55, y: 0.4 },
        leftWrist: { x: 0.3, y: 0.55 },
        rightWrist: { x: 0.5, y: 0.3 },
        leftHip: { x: 0.4, y: 0.6 },
        rightHip: { x: 0.6, y: 0.6 },
        leftKnee: { x: 0.4, y: 0.75 },
        rightKnee: { x: 0.6, y: 0.75 },
        leftAnkle: { x: 0.4, y: 0.9 },
        rightAnkle: { x: 0.6, y: 0.9 },
      },
      state: {
        ...DEFAULT_STATE,
        headTilt: 0.3,
        mouthExpression: "neutral",
      },
    },
  ];
}

// Running animation (faster walking)
export function getRunningAnimation(): AnimationFrame[] {
  const baseState: CharacterState = {
    ...DEFAULT_STATE,
    eyeExpression: "normal",
    mouthExpression: "neutral",
  };

  return [
    {
      pose: {
        nose: { x: 0.5, y: 0.18 },
        leftShoulder: { x: 0.4, y: 0.33 },
        rightShoulder: { x: 0.6, y: 0.33 },
        leftElbow: { x: 0.3, y: 0.4 },
        rightElbow: { x: 0.7, y: 0.55 },
        leftWrist: { x: 0.25, y: 0.5 },
        rightWrist: { x: 0.75, y: 0.65 },
        leftHip: { x: 0.42, y: 0.58 },
        rightHip: { x: 0.58, y: 0.58 },
        leftKnee: { x: 0.42, y: 0.73 },
        rightKnee: { x: 0.58, y: 0.65 },
        leftAnkle: { x: 0.42, y: 0.88 },
        rightAnkle: { x: 0.58, y: 0.75 },
      },
      state: baseState,
    },
    {
      pose: {
        nose: { x: 0.5, y: 0.16 },
        leftShoulder: { x: 0.4, y: 0.31 },
        rightShoulder: { x: 0.6, y: 0.31 },
        leftElbow: { x: 0.3, y: 0.25 },
        rightElbow: { x: 0.7, y: 0.4 },
        leftWrist: { x: 0.25, y: 0.2 },
        rightWrist: { x: 0.75, y: 0.5 },
        leftHip: { x: 0.42, y: 0.56 },
        rightHip: { x: 0.58, y: 0.56 },
        leftKnee: { x: 0.42, y: 0.65 },
        rightKnee: { x: 0.58, y: 0.71 },
        leftAnkle: { x: 0.42, y: 0.75 },
        rightAnkle: { x: 0.58, y: 0.86 },
      },
      state: baseState,
    },
  ];
}

// Export all animations
export const ANIMATION_PRESETS = {
  walking_cycle: getWalkingCycleAnimation,
  running: getRunningAnimation,
  jump: getJumpAnimation,
  happy: getHappyAnimation,
  sad: getSadAnimation,
  angry: getAngryAnimation,
  shocked: getShockedAnimation,
  sleeping: getSleepingAnimation,
  punch: getPunchAnimation,
  winner: getWinnerAnimation,
  phone: getPhoneAnimation,
  normal: () => [{ pose: createTPose(), state: DEFAULT_STATE }],
};
