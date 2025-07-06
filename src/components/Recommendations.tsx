import React from "react";
import { Play, TrendingUp, Music, Clock, Eye } from "lucide-react";
import { VideoResult } from "../types";

interface RecommendationsProps {
  recommendations: VideoResult[];
  onPlayAudio: (video: VideoResult) => void;
  isLoading?: boolean;
  title?: string;
}

export const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
  onPlayAudio,
  isLoading = false,
  title = "Recommended for you",
}) => {
  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-purple-400" />
          {title}
        </h2>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-32 h-20 bg-gray-700 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-700 rounded w-1/2" />
                <div className="h-3 bg-gray-700 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Music className="h-6 w-6 mr-2 text-purple-400" />
          {title}
        </h2>
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">
            No recommendations available at the moment.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <TrendingUp className="h-6 w-6 mr-2 text-purple-400" />
        {title}
      </h2>
      <div className="space-y-4">
        {recommendations.map((video) => (
          <div
            key={video.id}
            className="flex items-center bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg group"
          >
            <div className="flex-shrink-0 w-32 h-20 overflow-hidden rounded-md mr-4">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex-1 overflow-hidden">
              <h3 className="text-white font-medium line-clamp-2 group-hover:text-purple-300 transition-colors duration-200">
                {video.title}
              </h3>
              <p className="text-gray-400 text-sm truncate">{video.channel}</p>
              <div className="flex items-center text-xs text-gray-500 space-x-4 mt-1">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {video.duration}
                </span>
                <span className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {video.views}
                </span>
              </div>
            </div>

            <button
              onClick={() => onPlayAudio(video)}
              className="ml-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-md hover:shadow-xl transition duration-200 hover:scale-105"
            >
              <Play className="h-5 w-5 ml-0.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
