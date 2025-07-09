import React from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  Maximize,
  Music,
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
          ? "fixed inset-0 z-50 bg-gradient-to-b from-black to-gray-900 text-white flex flex-col items-center justify-center px-6 py-10"
          : "fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-md rounded-2xl px-6 py-4 border border-gray-700 shadow-xl z-40 w-[90%] max-w-2xl"
      }`}
    >
      {/* Close Button only for popup */}
      {isPopup && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* ---- MINI MODE (unchanged) ---- */}
      {!isPopup && (
        <div className="flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={onExpand}
          >
            {track.thumbnail ? (
              <img
                src={track.thumbnail}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <Music className="h-5 w-5 text-purple-400" />
            )}

            <span className="truncate sm:max-w-[450px] max-w-[200px] text-white text-sm font-medium">
              {track.title}
            </span>
          </div>

          <button
            onClick={isPlaying ? onPause : onPlay}
            className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 shadow-md"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white ml-0.5" />
            )}
          </button>
        </div>
      )}

      {/* ---- POPUP UI (modernized) ---- */}
      {isPopup && (
        <div className="flex flex-col items-center h-screen justify-center  rounded-lg shadow-2xl p-10 bg-gradient-to-br from-purple-900/30 to-blue-900/30">
          <div className="flex  flex-col sm:flex-row justify-center items-center sm:items-start w-full gap-6 sm:gap-12 mt-4 sm:mt-0">
            {/* Album Art */}
            <div className="w-[260px] h-[260px] border border-white p-2 sm:w-[300px] sm:h-[300px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={track.thumbnail}
                alt={track.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info + Controls */}
            <div className="flex flex-col items-center sm:items-start w-full max-w-xl">
              <div className="text-center sm:text-left mb-6">
                <h1 className="text-2xl sm:text-4xl font-bold">
                  {track.title}
                </h1>
                <p className="text-purple-400 mt-1 text-sm sm:text-base">
                  {track.artist || "Unknown Artist"}
                </p>
              </div>

              {/* Seekbar */}
              <div className="flex items-center gap-3 w-full">
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

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 mt-6 w-full">
                <button
                  onClick={onPrev}
                  className="p-3 rounded-full bg-gray-800 hover:bg-gray-700"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={isPlaying ? onPause : onPlay}
                  className="p-5 rounded-full bg-purple-500 hover:bg-purple-600 shadow-md"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  )}
                </button>
                <button
                  onClick={onNext}
                  className="p-3 rounded-full bg-gray-800 hover:bg-gray-700"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
