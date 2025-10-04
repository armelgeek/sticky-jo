"use client";

import { Keyframe } from "@/app/animator/page";

interface ControlsProps {
  keyframes: Keyframe[];
  selectedKeyframeId: string | null;
  onAddKeyframe: () => void;
  onDeleteKeyframe: () => void;
  duration: number;
  onDurationChange: (duration: number) => void;
}

export default function Controls({
  keyframes,
  selectedKeyframeId,
  onAddKeyframe,
  onDeleteKeyframe,
  duration,
  onDurationChange,
}: ControlsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Animation Controls</h3>
        
        {/* Keyframe Controls */}
        <div className="space-y-2">
          <button
            onClick={onAddKeyframe}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Keyframe</span>
          </button>

          <button
            onClick={onDeleteKeyframe}
            disabled={!selectedKeyframeId}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete Keyframe</span>
          </button>
        </div>
      </div>

      {/* Duration Control */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Duration: {(duration / 1000).toFixed(1)}s
        </label>
        <input
          type="range"
          min="1000"
          max="30000"
          step="100"
          value={duration}
          onChange={(e) => onDurationChange(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1s</span>
          <span>30s</span>
        </div>
      </div>

      {/* Keyframe List */}
      <div>
        <h4 className="text-sm font-medium mb-2">
          Keyframes ({keyframes.length})
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {keyframes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No keyframes yet.<br />Click &quot;Add Keyframe&quot; to start.
            </p>
          ) : (
            keyframes.map((keyframe, index) => (
              <div
                key={keyframe.id}
                className={`p-2 rounded text-sm ${
                  selectedKeyframeId === keyframe.id
                    ? "bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
                } transition-colors`}
              >
                Keyframe {index + 1} - {(keyframe.time / 1000).toFixed(2)}s
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-400 space-y-2 border-t border-gray-700 pt-4">
        <h4 className="font-medium text-gray-300">How to use:</h4>
        <ol className="list-decimal list-inside space-y-1">
          <li>Add keyframes at different times</li>
          <li>Drag blue points to pose the figure</li>
          <li>Animation will tween between keyframes</li>
          <li>Use timeline to preview and adjust</li>
          <li>Export when ready</li>
        </ol>
      </div>
    </div>
  );
}
