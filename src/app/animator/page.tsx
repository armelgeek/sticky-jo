"use client";

import { useState } from "react";
import Link from "next/link";
import AnimationCanvas from "@/components/animator/AnimationCanvas";
import Timeline from "@/components/animator/Timeline";
import Controls from "@/components/animator/Controls";
import ExportPanel from "@/components/animator/ExportPanel";
import { PoseKeypoints } from "@/lib/video/poseEstimation";
import { CharacterState, DEFAULT_STATE } from "@/lib/character/types";
import { ANIMATION_PRESETS } from "@/lib/character/presets";

export interface Keyframe {
  id: string;
  time: number; // in milliseconds
  pose: PoseKeypoints;
}

export default function AnimatorPage() {
  const [keyframes, setKeyframes] = useState<Keyframe[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedKeyframeId, setSelectedKeyframeId] = useState<string | null>(null);
  const [duration, setDuration] = useState(5000); // 5 seconds default
  const [characterState, setCharacterState] = useState<CharacterState>(DEFAULT_STATE);

  const addKeyframe = (pose: PoseKeypoints) => {
    const newKeyframe: Keyframe = {
      id: `keyframe-${Date.now()}`,
      time: currentTime,
      pose,
    };
    
    const newKeyframes = [...keyframes, newKeyframe].sort((a, b) => a.time - b.time);
    setKeyframes(newKeyframes);
    setSelectedKeyframeId(newKeyframe.id);
  };

  const updateKeyframe = (id: string, pose: PoseKeypoints) => {
    setKeyframes(keyframes.map(kf => 
      kf.id === id ? { ...kf, pose } : kf
    ));
  };

  const deleteKeyframe = (id: string) => {
    setKeyframes(keyframes.filter(kf => kf.id !== id));
    if (selectedKeyframeId === id) {
      setSelectedKeyframeId(null);
    }
  };

  const getCurrentPose = (): PoseKeypoints | null => {
    if (keyframes.length === 0) return null;
    
    // Find keyframes surrounding current time
    const before = keyframes.filter(kf => kf.time <= currentTime).pop();
    const after = keyframes.find(kf => kf.time > currentTime);

    if (!before) return keyframes[0].pose;
    if (!after) return before.pose;

    // Interpolate between keyframes
    const t = (currentTime - before.time) / (after.time - before.time);
    return interpolatePose(before.pose, after.pose, t);
  };

  const loadAnimationPreset = (presetName: keyof typeof ANIMATION_PRESETS) => {
    const preset = ANIMATION_PRESETS[presetName]();
    const frameDuration = duration / preset.length;
    
    const newKeyframes = preset.map((frame, index) => ({
      id: `keyframe-${Date.now()}-${index}`,
      time: index * frameDuration,
      pose: frame.pose,
    }));
    
    setKeyframes(newKeyframes);
    setSelectedKeyframeId(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
            <h1 className="text-xl font-bold">Stick Figure Animator</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Canvas and Controls Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 flex items-center justify-center p-8">
            <AnimationCanvas
              pose={getCurrentPose()}
              onPoseChange={(pose) => {
                if (selectedKeyframeId) {
                  const selectedKf = keyframes.find(kf => kf.id === selectedKeyframeId);
                  if (selectedKf) {
                    updateKeyframe(selectedKeyframeId, pose);
                  }
                }
              }}
              isEditable={selectedKeyframeId !== null}
              characterState={characterState}
            />
          </div>

          {/* Right Panel - Controls */}
          <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
            {/* Character Controls */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Character</h3>
              
              {/* Scale */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Scale</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={characterState.scale}
                  onChange={(e) => setCharacterState({ ...characterState, scale: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{characterState.scale.toFixed(1)}x</span>
              </div>

              {/* Flip */}
              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={characterState.flip}
                    onChange={(e) => setCharacterState({ ...characterState, flip: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Flip Horizontally</span>
                </label>
              </div>

              {/* Expression */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Eye Expression</label>
                <select
                  value={characterState.eyeExpression}
                  onChange={(e) => setCharacterState({ 
                    ...characterState, 
                    eyeExpression: e.target.value as CharacterState['eyeExpression']
                  })}
                  className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="happy">Happy</option>
                  <option value="angry">Angry</option>
                  <option value="sad">Sad</option>
                  <option value="shocked">Shocked</option>
                  <option value="bored">Bored</option>
                </select>
              </div>

              {/* Mouth Expression */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Mouth</label>
                <select
                  value={characterState.mouthExpression}
                  onChange={(e) => setCharacterState({ 
                    ...characterState, 
                    mouthExpression: e.target.value as CharacterState['mouthExpression']
                  })}
                  className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm"
                >
                  <option value="smile">Smile</option>
                  <option value="frown">Frown</option>
                  <option value="neutral">Neutral</option>
                  <option value="surprised">Surprised</option>
                  <option value="angry">Angry</option>
                </select>
              </div>

              {/* Eyes Open/Closed */}
              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={characterState.eyesOpen}
                    onChange={(e) => setCharacterState({ ...characterState, eyesOpen: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm">Eyes Open</span>
                </label>
              </div>

              {/* Head Tilt */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Head Tilt</label>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.1"
                  value={characterState.headTilt}
                  onChange={(e) => setCharacterState({ ...characterState, headTilt: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{characterState.headTilt > 0 ? 'Right' : characterState.headTilt < 0 ? 'Left' : 'Center'}</span>
              </div>
            </div>

            {/* Animation Presets */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Animation Presets</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => loadAnimationPreset('walking_cycle')}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  Walking
                </button>
                <button
                  onClick={() => loadAnimationPreset('running')}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  Running
                </button>
                <button
                  onClick={() => loadAnimationPreset('jump')}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  Jump
                </button>
                <button
                  onClick={() => loadAnimationPreset('punch')}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  Punch
                </button>
                <button
                  onClick={() => loadAnimationPreset('happy')}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  Happy
                </button>
                <button
                  onClick={() => loadAnimationPreset('sad')}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  Sad
                </button>
                <button
                  onClick={() => loadAnimationPreset('angry')}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  Angry
                </button>
                <button
                  onClick={() => loadAnimationPreset('shocked')}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  Shocked
                </button>
                <button
                  onClick={() => loadAnimationPreset('sleeping')}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  Sleeping
                </button>
                <button
                  onClick={() => loadAnimationPreset('phone')}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  Phone
                </button>
                <button
                  onClick={() => loadAnimationPreset('winner')}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  Winner
                </button>
                <button
                  onClick={() => loadAnimationPreset('normal')}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  T-Pose
                </button>
              </div>
            </div>

            <Controls
              keyframes={keyframes}
              selectedKeyframeId={selectedKeyframeId}
              onAddKeyframe={() => {
                const pose = getCurrentPose() || getDefaultPose();
                addKeyframe(pose);
              }}
              onDeleteKeyframe={() => {
                if (selectedKeyframeId) {
                  deleteKeyframe(selectedKeyframeId);
                }
              }}
              duration={duration}
              onDurationChange={setDuration}
            />
            
            <div className="mt-6">
              <ExportPanel
                keyframes={keyframes}
                duration={duration}
              />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="h-40 bg-gray-800 border-t border-gray-700">
          <Timeline
            keyframes={keyframes}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            selectedKeyframeId={selectedKeyframeId}
            onTimeChange={setCurrentTime}
            onKeyframeSelect={setSelectedKeyframeId}
            onKeyframeMove={(id, newTime) => {
              setKeyframes(keyframes.map(kf => 
                kf.id === id ? { ...kf, time: newTime } : kf
              ).sort((a, b) => a.time - b.time));
            }}
            onPlayPause={() => setIsPlaying(!isPlaying)}
          />
        </div>
      </div>
    </div>
  );
}

// Helper function to interpolate between two poses
function interpolatePose(pose1: PoseKeypoints, pose2: PoseKeypoints, t: number): PoseKeypoints {
  const lerp = (a: number, b: number) => a + (b - a) * t;
  
  const interpolatePoint = (p1: { x: number; y: number }, p2: { x: number; y: number }) => ({
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

// Default T-pose
function getDefaultPose(): PoseKeypoints {
  return {
    nose: { x: 0.5, y: 0.2 },
    leftShoulder: { x: 0.4, y: 0.35 },
    rightShoulder: { x: 0.6, y: 0.35 },
    leftElbow: { x: 0.3, y: 0.35 },
    rightElbow: { x: 0.7, y: 0.35 },
    leftWrist: { x: 0.2, y: 0.35 },
    rightWrist: { x: 0.8, y: 0.35 },
    leftHip: { x: 0.45, y: 0.55 },
    rightHip: { x: 0.55, y: 0.55 },
    leftKnee: { x: 0.45, y: 0.7 },
    rightKnee: { x: 0.55, y: 0.7 },
    leftAnkle: { x: 0.45, y: 0.85 },
    rightAnkle: { x: 0.55, y: 0.85 },
  };
}
