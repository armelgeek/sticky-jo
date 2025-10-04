/**
 * Character types and interfaces for enhanced stick figures
 */

import { PoseKeypoints } from "@/lib/video/poseEstimation";

export interface CharacterStyle {
  // Body proportions
  headSize: number;
  jointSize: number;
  torsoWidth: number;
  limbWidth: number;
  
  // Colors
  skinColor: string;
  outlineColor: string;
  eyeColor: string;
  
  // Features
  hasOutline: boolean;
  showJoints: boolean;
}

export interface CharacterState {
  // Transform
  scale: number;
  flip: boolean; // flip horizontally
  
  // Face
  eyesOpen: boolean;
  eyeExpression: "normal" | "happy" | "angry" | "sad" | "shocked" | "bored";
  mouthOpen: boolean;
  mouthExpression: "smile" | "frown" | "neutral" | "surprised" | "angry";
  
  // Head
  headTilt: number; // -1 to 1 (left to right tilt)
  headTurn: number; // -1 to 1 (look left to right)
}

export interface AnimationFrame {
  pose: PoseKeypoints;
  state: CharacterState;
}

export type AnimationPreset = 
  | "walking_cycle"
  | "running"
  | "jump"
  | "slap"
  | "slap_react"
  | "phone"
  | "typing_in_phone"
  | "punch"
  | "punch_react"
  | "sleeping"
  | "happy"
  | "angry"
  | "sad"
  | "shock"
  | "bored"
  | "crying"
  | "looser"
  | "winner"
  | "normal"
  | "thuglife"
  | "bruised"
  | "shocked";

export const DEFAULT_STYLE: CharacterStyle = {
  headSize: 1.0,
  jointSize: 0.8,
  torsoWidth: 1.0,
  limbWidth: 1.0,
  skinColor: "#FFD4A3",
  outlineColor: "#000000",
  eyeColor: "#000000",
  hasOutline: true,
  showJoints: true,
};

export const DEFAULT_STATE: CharacterState = {
  scale: 1.0,
  flip: false,
  eyesOpen: true,
  eyeExpression: "normal",
  mouthOpen: false,
  mouthExpression: "smile",
  headTilt: 0,
  headTurn: 0,
};
