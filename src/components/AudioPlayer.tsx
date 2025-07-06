import React from "react";
import { Play, Pause, Square } from "lucide-react";
import { PlayerState } from "../types";

interface AudioPlayerProps {
  playerState: PlayerState;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  playerState,
  onPlay,
  onPause,
  onStop,
  onSeek,
}) => {
  const { isPlaying, currentTime, duration } = playerState;

  const progressPercentage = (currentTime / (duration || 1)) * 100;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-md rounded-2xl px-6 py-4 border border-gray-700 shadow-xl z-50 w-[90%] max-w-2xl transition-all duration-300">
      <div className="flex items-center justify-between space-x-6">
        {/* Playback Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={isPlaying ? onPause : onPlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-md hover:shadow-lg transition-transform duration-150 hover:scale-110"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </button>
          <button
            onClick={onStop}
            aria-label="Stop"
            className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-3 shadow-md hover:shadow-lg transition-transform duration-150 hover:scale-110"
          >
            <Square className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 flex items-center space-x-3">
          <span className="text-xs text-gray-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #9333ea 0%, #9333ea ${progressPercentage}%, #374151 ${progressPercentage}%, #374151 100%)`,
            }}
          />
          <span className="text-xs text-gray-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};
