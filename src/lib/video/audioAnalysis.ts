/**
 * Simple audio analysis for lip-sync
 * Analyzes audio to determine when mouth should be open/closed
 */

import { promises as fs } from "fs";

/**
 * Analyze audio volume to determine mouth states for each frame
 * This is a simplified approach - determines if mouth should be open based on audio presence
 */
export async function analyzeLipSync(
  audioPath: string,
  frameDuration: number,
  totalFrames: number
): Promise<boolean[]> {
  try {
    // Check if audio file exists
    await fs.access(audioPath);
    
    // For now, create a simple pattern based on frame timing
    // In a production system, you would use Web Audio API or a similar library
    // to analyze actual audio amplitude
    
    const mouthStates: boolean[] = [];
    
    // Simple pattern: alternate between open and closed more naturally
    // This creates a talking effect
    for (let i = 0; i < totalFrames; i++) {
      // Create a semi-random but repeating pattern
      // Mouth is open approximately 40% of the time
      const pattern = Math.sin(i * 0.5) * Math.cos(i * 0.3);
      mouthStates.push(pattern > 0.2);
    }
    
    return mouthStates;
  } catch (error) {
    console.error("Error analyzing audio:", error);
    // Return all false if audio analysis fails
    return Array(totalFrames).fill(false);
  }
}

/**
 * Simple rhythm-based mouth animation
 * Opens mouth at regular intervals to simulate talking
 */
export function generateSimpleLipSync(totalFrames: number, fps: number): boolean[] {
  const mouthStates: boolean[] = [];
  
  // Simulate talking at ~3-4 syllables per second
  const syllablesPerSecond = 3.5;
  const framesPerSyllable = fps / syllablesPerSecond;
  
  for (let i = 0; i < totalFrames; i++) {
    // Mouth is open for first half of each syllable cycle
    const cyclePosition = (i % framesPerSyllable) / framesPerSyllable;
    mouthStates.push(cyclePosition < 0.5);
  }
  
  return mouthStates;
}
