import React, { useState, useEffect } from "react";
import { Search, Mic, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onQueryChange: (query: string) => void;
  isLoading?: boolean;
  query: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onQueryChange,
  isLoading = false,
  query,
}) => {
  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onSearch(localQuery.trim() + "+Songs");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    onQueryChange(value);
  };

  const clearSearch = () => {
    setLocalQuery("");
    onQueryChange("");
  };

  const disabled = isLoading || !localQuery.trim();

  return (
    <div className="w-full max-w-2xl mx-auto mb-6 px-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-3 sm:space-y-0 sm:relative"
      >
        {/* Input Row */}
        <div className="relative flex items-center bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 focus-within:border-purple-500/50 focus-within:shadow-purple-500/20">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>

          <input
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            placeholder="Search for music, artists, or songs..."
            className="w-full pl-12 pr-20 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none rounded-full"
            disabled={isLoading}
          />

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
            {localQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-2 rounded-full hover:bg-gray-700/50 transition duration-200"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-white" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                /* implement voice */
              }}
              className="p-2 rounded-full hover:bg-gray-700/50 transition duration-200"
            >
              <Mic className="h-5 w-5 text-gray-400 hover:text-white" />
            </button>

            {/* Desktop submit */}
            <button
              type="submit"
              disabled={disabled}
              className="hidden sm:inline-block ml-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Mobile Submit */}
        <button
          type="submit"
          disabled={disabled}
          className="sm:hidden w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>
    </div>
  );
};
