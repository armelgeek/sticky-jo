"use client";

import { useEffect, useRef } from "react";
import { Keyframe } from "@/app/animator/page";

interface TimelineProps {
  keyframes: Keyframe[];
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  selectedKeyframeId: string | null;
  onTimeChange: (time: number) => void;
  onKeyframeSelect: (id: string) => void;
  onKeyframeMove: (id: string, newTime: number) => void;
  onPlayPause: () => void;
}

export default function Timeline({
  keyframes,
  currentTime,
  duration,
  isPlaying,
  selectedKeyframeId,
  onTimeChange,
  onKeyframeSelect,
  onKeyframeMove,
  onPlayPause,
}: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    let lastTime = Date.now();
    const animate = () => {
      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;

      const newTime = currentTime + deltaTime;
      if (newTime >= duration) {
        onTimeChange(0);
      } else {
        onTimeChange(newTime);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentTime, duration, onTimeChange]);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = Math.max(0, Math.min(duration, percentage * duration));
    
    onTimeChange(newTime);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, "0")}s`;
  };

  return (
    <div className="h-full p-4 flex flex-col">
      {/* Playback Controls */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={onPlayPause}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => onTimeChange(0)}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm"
          >
            Reset
          </button>
        </div>
        <div className="text-sm text-gray-400">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Timeline Track */}
      <div
        ref={timelineRef}
        className="flex-1 bg-gray-700 rounded relative cursor-pointer"
        onClick={handleTimelineClick}
      >
        {/* Keyframe markers */}
        {keyframes.map((keyframe) => {
          const position = (keyframe.time / duration) * 100;
          return (
            <div
              key={keyframe.id}
              className={`absolute top-0 bottom-0 w-2 cursor-move ${
                selectedKeyframeId === keyframe.id
                  ? "bg-yellow-500"
                  : "bg-blue-500"
              } hover:bg-yellow-400 transition-colors`}
              style={{ left: `calc(${position}% - 4px)` }}
              onClick={(e) => {
                e.stopPropagation();
                onKeyframeSelect(keyframe.id);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                
                const startX = e.clientX;
                const startTime = keyframe.time;
                const timelineRect = timelineRef.current?.getBoundingClientRect();
                if (!timelineRect) return;

                const handleMouseMove = (moveEvent: MouseEvent) => {
                  const deltaX = moveEvent.clientX - startX;
                  const deltaTime = (deltaX / timelineRect.width) * duration;
                  const newTime = Math.max(0, Math.min(duration, startTime + deltaTime));
                  onKeyframeMove(keyframe.id, newTime);
                };

                const handleMouseUp = () => {
                  document.removeEventListener("mousemove", handleMouseMove);
                  document.removeEventListener("mouseup", handleMouseUp);
                };

                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
              }}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-gray-400">
                {formatTime(keyframe.time)}
              </div>
            </div>
          );
        })}

        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        >
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}
