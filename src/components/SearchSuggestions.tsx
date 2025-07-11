import React from "react";
import { Play, Clock } from "lucide-react";
import { SearchSuggestion } from "../types";

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onPlayAudio: (suggestion: SearchSuggestion) => void;
  isLoading: boolean;
  isVisible: boolean;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onPlayAudio,
  isLoading,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="p-4">
            <div className="flex items-center space-x-3 text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
              <span className="text-sm">Finding suggestions...</span>
            </div>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="max-h-80 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="flex items-center space-x-3 p-3 hover:bg-gray-700/50 transition-colors duration-200 border-b border-gray-700/30 last:border-b-0 group"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={suggestion.thumbnail}
                    alt={suggestion.title}
                    className="w-16 h-12 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
                    <button
                      onClick={() => onPlayAudio(suggestion)}
                      className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <Play className="h-3 w-3 ml-0.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-medium line-clamp-2 group-hover:text-purple-300 transition-colors duration-200">
                    {suggestion.title}
                  </h4>
                  <p className="text-gray-400 text-xs truncate mt-1">
                    {suggestion.channel}
                  </p>
                </div>

                <button
                  onClick={() => onPlayAudio(suggestion)}
                  className="flex-shrink-0 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-white px-3 py-1.5 rounded-lg transition-all duration-200 text-xs font-medium border border-purple-500/30 hover:border-purple-500/50"
                >
                  Play
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-400 text-sm">
            No suggestions found
          </div>
        )}
      </div>
    </div>
  );
};
