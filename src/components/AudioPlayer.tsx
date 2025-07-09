import React from "react";
import {
  Play,
  Pause,
  Square,
  Music,
  X,
  Maximize,
  SkipBack,
  SkipForward,
} from "lucide-react";
import {
  PlayerState,
  CurrentTrack as CurrentTrackType,
  VideoResult,
} from "../types";

interface AudioPlayerProps {
  playerState: PlayerState;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  track: CurrentTrackType | null;
  mode: "mini" | "popup";
  onClose?: () => void;
  onExpand?: () => void;
  suggestions?: VideoResult[];
  onPlaySuggestion?: (video: VideoResult) => void;
  onNext?: () => void;
  onPrev?: () => void;
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
  track,
  mode,
  onClose,
  onExpand,
  onNext,
  onPrev,
}) => {
  if (!track) return null;

  const { isPlaying, currentTime, duration } = playerState;
  const progressPercentage = (currentTime / (duration || 1)) * 100;
  const isPopup = mode === "popup";

  return (
    <div
      className={`${
        isPopup
          ? "fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center px-6 py-10 overflow-auto"
          : "fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-md rounded-2xl px-6 py-4 border border-gray-700 shadow-xl z-40 w-[90%] max-w-2xl transition-all duration-300"
      }`}
    >
      {/* Close Button for popup */}
      {isPopup && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl"
        >
          <X />
        </button>
      )}

      {/* Track Info */}
      <div
        className={`flex ${
          isPopup
            ? "flex-col items-center gap-4  p-6"
            : "items-center justify-between mb-4"
        }`}
      >
        <div className="items-center p-2 flex flex-col">
          {isPopup && (
            <img
              src={track.thumbnail}
              alt={track.title}
              className="h-40 w-40 rounded-xl shadow-lg"
            />
          )}
          <div className="flex items-center p-2 space-x-2 text-white text-sm font-medium">
            <Music className="h-5 w-5 text-purple-400" />
            <span className="truncate relative sm:max-w-full max-w-[200px]">
              {track.title}
            </span>
          </div>
        </div>

        {/* Expand button in mini-mode */}
        {!isPopup && onExpand && (
          <button
            onClick={onExpand}
            className="ml-auto bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-full text-sm flex items-center space-x-1"
          >
            <Maximize className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col ">
        {/* Controls */}
        <div className="flex items-center justify-center sm:space-x-4 sm:w-full max-w-xl py-2">
          {
            <button
              onClick={onPrev}
              className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-3 shadow-md m-2"
            >
              <SkipBack className="h-5 w-5" />
            </button>
          }

          <button
            onClick={isPlaying ? onPause : onPlay}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-md"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </button>

          {
            <button
              onClick={onNext}
              className="bg-gray-700 hover:bg-gray-600 m-2 text-white rounded-full p-3 shadow-md"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          }
        </div>

        {/* Seekbar */}
        <div className="flex items-center space-x-3 w-full max-w-xl px-4">
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
