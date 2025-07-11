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
      {/* MINI MODE - Enhanced */}
      {!isPopup && (
        <div className="p-3 sm:p-4">
          {/* Progress Bar at Top */}
          <div className="w-full h-1 bg-slate-700 rounded-full mb-3 sm:mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Track Info */}
            <div
              className="flex items-center space-x-3 sm:space-x-4 cursor-pointer flex-1 min-w-0"
              onClick={onExpand}
            >
              <div className="relative flex-shrink-0">
                {track.thumbnail ? (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src={track.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                    <Music className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                )}
                {/* Playing Indicator */}
                {isPlaying && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800 animate-pulse" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-white text-sm sm:text-base font-semibold leading-tight">
                  {track.title}
                </h3>
                <p className="truncate text-slate-400 text-xs sm:text-sm mt-0.5">
                  {track.channel || "Unknown Artist"}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <button
                onClick={onPrev}
                className="p-2 sm:p-2.5 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={isPlaying ? onPause : onPlay}
                className="p-3 sm:p-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5" />
                )}
              </button>

              <button
                onClick={onNext}
                className="p-2 sm:p-2.5 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- POPUP UI (modernized) ---- */}
      {isPopup && (
        <div className="flex flex-col items-center rounded-xl justify-center h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-6 sm:p-10 text-white relative overflow-hidden">
          {/* Background Blurred Art */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 blur-3xl scale-105 z-0"
            style={{ backgroundImage: `url(${track.thumbnail})` }}
          ></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8 w-full max-w-6xl">
            {/* Album Art */}
            <div className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-4 border-white/10">
              <img
                src={track.thumbnail}
                alt={track.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info & Controls */}
            <div className="flex flex-col items-center sm:items-start w-full max-w-xl">
              {/* Track Info */}
              <div className="text-center sm:text-left mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold line-clamp-2">
                  {track.title}
                </h1>
                <p className="text-purple-300 mt-1 text-sm sm:text-base">
                  {track.channel || "Unknown Artist"}
                </p>
              </div>

              {/* Seekbar */}
              <div className="w-full mb-4">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="w-10 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    onChange={(e) => onSeek(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    style={{
                      background: `linear-gradient(to right, #a855f7 ${progressPercentage}%, #4b5563 ${progressPercentage}%)`,
                    }}
                  />
                  <span className="w-10">{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6 mt-2 w-full">
                <button
                  onClick={onPrev}
                  className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={isPlaying ? onPause : onPlay}
                  className="p-5 rounded-full bg-purple-600 hover:bg-purple-700 transition shadow-xl"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" />
                  )}
                </button>
                <button
                  onClick={onNext}
                  className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition"
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
