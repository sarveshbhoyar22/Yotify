import React from "react";
import { Play, Clock, Eye } from "lucide-react";
import { VideoResult } from "../types";

interface SearchResultsProps {
  results: VideoResult[];
  onPlayAudio: (video: VideoResult) => void;
  isLoading?: boolean;
  searchTerm?: string; // 👈 New prop to support highlighting
}

const highlight = (text: string, term: string) => {
  if (!term) return text;
  const regex = new RegExp(`(${term})`, "gi");
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="bg-purple-700/30 text-purple-300">
        {part}
      </span>
    ) : (
      part
    )
  );
};

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onPlayAudio,
  isLoading = false,
  searchTerm = "",
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4 mb-8">
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
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">
          No results found. Try a different search term.
        </div>
      </div>
    );
  }

  // Sort results by views descending for relevance (can be changed to duration or date)
  const sortedResults = [...results].sort(
    (a, b) =>
      parseInt(b.views.replace(/[^0-9]/g, "")) -
      parseInt(a.views.replace(/[^0-9]/g, ""))
  );

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">Search Results</h2>
      <div className="space-y-4">
        {sortedResults.map((video) => (
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
                {highlight(video.title, searchTerm)}
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
