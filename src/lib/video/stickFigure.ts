/**
 * Stick figure drawing on canvas
 * Draws simplified stick figures on white background
 */

import { createCanvas } from "canvas";
import { promises as fs } from "fs";
import { PoseKeypoints } from "./poseEstimation";
import { drawEnhancedCharacter } from "../character/drawing";
import { CharacterStyle, CharacterState, DEFAULT_STYLE, DEFAULT_STATE } from "../character/types";

export interface DrawOptions {
  width: number;
  height: number;
  lineWidth: number;
  color: string;
  mouthOpen: boolean;
  eyesOpen?: boolean;
  characterStyle?: Partial<CharacterStyle>;
  characterState?: Partial<CharacterState>;
}

const DEFAULT_OPTIONS: DrawOptions = {
  width: 512,
  height: 512,
  lineWidth: 3,
  color: "#000000",
  mouthOpen: false,
  eyesOpen: true,
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

  // Use enhanced character drawing
  const characterState: CharacterState = {
    ...DEFAULT_STATE,
    mouthOpen: opts.mouthOpen,
    eyesOpen: opts.eyesOpen ?? true,
    ...opts.characterState,
  };

  const characterStyle: CharacterStyle = {
    ...DEFAULT_STYLE,
    outlineColor: opts.color,
    ...opts.characterStyle,
  };

  drawEnhancedCharacter(ctx, keypoints, opts.width, opts.height, characterStyle, characterState);

  // Save to file
  const buffer = canvas.toBuffer("image/png");
  await fs.writeFile(outputPath, buffer);
}
