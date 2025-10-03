"use client";

import { useState } from "react";
import Link from "next/link";
import AnimationCanvas from "@/components/animator/AnimationCanvas";
import Timeline from "@/components/animator/Timeline";
import Controls from "@/components/animator/Controls";
import ExportPanel from "@/components/animator/ExportPanel";
import { PoseKeypoints } from "@/lib/video/poseEstimation";

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
            />
          </div>

          {/* Right Panel - Controls */}
          <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
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
