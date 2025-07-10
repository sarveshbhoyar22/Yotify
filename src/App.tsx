import React, { useState, useEffect } from "react";
import { Headphones } from "lucide-react";

import { SearchBar } from "./components/SearchBar";
import { SearchSuggestions } from "./components/SearchSuggestions";
import { SearchResults } from "./components/SearchResults";
import { AudioPlayer } from "./components/AudioPlayer";
import { CurrentTrack } from "./components/CurrentTrack";
import { Recommendations } from "./components/Recommendations";
import { ErrorMessage } from "./components/ErrorMessage";
import { InstallButton } from "./components/InstallButton";

import { useYouTubePlayer } from "./hooks/useYouTubePlayer";
import { useDebounce } from "./hooks/useDebounce";

import {
  searchVideos,
  getSearchSuggestions,
  getTrendingVideos,
  getRelatedVideos,
} from "./api/youtubeApi";

import { VideoResult, SearchSuggestion } from "./types";
import { db } from "./firebase";
import {
  initCache,
  getCache,
  setCache,
  fetchFromCache,
  preloadFirestoreCache,
} from "./utils/cache";

function App() {
  const [showPlayerPopup, setShowPlayerPopup] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<VideoResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recommendations, setRecommendations] = useState<VideoResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  const {
    playerRef,
    playerState,
    currentTrack,
    playVideo,
    pauseVideo,
    resumeVideo,
    stopVideo,
    seekTo,
    onVideoEnd,
  } = useYouTubePlayer();

  // 🌐 Init Firebase cache on first load

  useEffect(() => {
    initCache(db);
    preloadFirestoreCache(); // preload all data once
  }, []);

  useEffect(() => {
    onVideoEnd(() => {
      if (!currentTrack) return;
      const index = recommendations.findIndex((v) => v.id === currentTrack.id);
      const next = recommendations[index + 1];
      if (next) {
        playVideo(next.id, next.title, next.channel, next.thumbnail);
      }
    });
  }, [currentTrack, recommendations]);

  const handleNext = () => {
    if (!currentTrack || recommendations.length === 0) return;
    const currentIndex = recommendations.findIndex(
      (v) => v.id === currentTrack.id
    );
    const nextIndex = (currentIndex + 1) % recommendations.length;
    const nextVideo = recommendations[nextIndex];
    playVideo(
      nextVideo.id,
      nextVideo.title,
      nextVideo.channel,
      nextVideo.thumbnail
    );
  };

  const handlePrev = () => {
    if (!currentTrack || recommendations.length === 0) return;
    const currentIndex = recommendations.findIndex(
      (v) => v.id === currentTrack.id
    );
    const prevIndex =
      (currentIndex - 1 + recommendations.length) % recommendations.length;
    const prevVideo = recommendations[prevIndex];
    playVideo(
      prevVideo.id,
      prevVideo.title,
      prevVideo.channel,
      prevVideo.thumbnail
    );
  };

  useEffect(() => {
    const loadTrendingVideos = async () => {
      setIsLoadingRecommendations(true);
      try {
        const cacheKey = "trending";
        const cached = await fetchFromCache(cacheKey);
        const trendingRaw = cached || (await getTrendingVideos(8));
        const trending = Array.isArray(trendingRaw)
          ? trendingRaw
          : Object.values(trendingRaw || {});
        if (!cached) setCache(cacheKey, trending);
        setRecommendations(trending);
        setError(null);
      } catch (err) {
        console.error("Error loading trending videos:", err);
        setError(
          "Failed to load trending videos. Please check your internet connection."
        );
      } finally {
        setIsLoadingRecommendations(false);
      }
    };
    loadTrendingVideos();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length >= 2 && showSuggestions) {
        setIsLoadingSuggestions(true);
        try {
          const cacheKey = `suggestions_${debouncedQuery}`;
          const cached = await fetchFromCache(cacheKey);
          const resultRaw =
            cached ||
            (await getSearchSuggestions(`${debouncedQuery} songs`, 7));
          const result = Array.isArray(resultRaw)
            ? resultRaw
            : Object.values(resultRaw || {});

          if (!cached) setCache(cacheKey, result);
          setSuggestions(result);
          setError(null);
        } catch (err) {
          console.error("Error fetching suggestions:", err);
          setSuggestions([]);
        } finally {
          setIsLoadingSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setIsLoadingSuggestions(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery, showSuggestions]);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setShowSuggestions(newQuery.length > 0);
  };

  const handleSearch = async (searchQuery: string) => {
    setIsSearching(true);
    setHasSearched(true);
    setShowSuggestions(false);
    setError(null);
    try {
      const searchKey = `search_${searchQuery}`;
      const cached = await fetchFromCache(searchKey);
      const results = cached || (await searchVideos(searchQuery, 12));
      if (!cached) setCache(searchKey, results);

      const safeResults = Array.isArray(results)
        ? results
        : Object.values(results || {});
      setSearchResults(safeResults);

      if (safeResults.length > 0) {
        const relatedKey = `related_${results[0].id}`;
        const relatedCached = await fetchFromCache(relatedKey);
        const relatedRaw =
          relatedCached || (await getRelatedVideos(results[0].id, 8));
        const related = Array.isArray(relatedRaw)
          ? relatedRaw
          : Object.values(relatedRaw || {});
        if (!relatedCached) setCache(relatedKey, related);
        setRecommendations(related);
      }
    } catch (err) {
      console.error("Error searching videos:", err);
      setError("Sorry, the server is busy. Please try again later.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlayAudio = (video: VideoResult | SearchSuggestion) => {
    setShowSuggestions(false);
    playVideo(video.id, video.title, video.channel, video.thumbnail);
  };

  const handlePlay = () => {
    if (currentTrack && playerState.isReady) {
      if (playerState.isPaused) {
        resumeVideo();
      } else if (playerState.isStopped) {
        playVideo(
          currentTrack.id,
          currentTrack.title,
          currentTrack.channel,
          currentTrack.thumbnail
        );
      }
    }
  };

  const handlePause = () => {
    if (playerState.isPlaying) {
      pauseVideo();
    }
  };

  const handleStop = () => {
    stopVideo();
  };

  const retryOperation = () => {
    setError(null);
    if (hasSearched && query) {
      handleSearch(query);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-20"></div>
      <div className="relative z-10">
        <header className="pt-8 pb-6 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-3 shadow-lg select-none">
                  <img
                    src="/icon.svg"
                    alt=""
                    className="h-10 w-10"
                    draggable="false"
                  />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Yotify
                </h1>
              </div>
            </div>
            <div className="text-center text-gray-400 mb-8">
              <div className="flex items-center justify-center space-x-2">
                <Headphones className="h-4 w-4" />
                <span>Stream YouTube audio with style (No Ads)</span>
              </div>
              <div>- Sarvesh Bhoyar</div>
            </div>
          </div>
        </header>

        <main className="px-4 pb-24">
          <div className="max-w-6xl mx-auto">
            <SearchBar
              onSearch={handleSearch}
              onQueryChange={handleQueryChange}
              isLoading={isSearching}
              query={query}
            />

            <SearchSuggestions
              suggestions={suggestions}
              onPlayAudio={handlePlayAudio}
              isLoading={isLoadingSuggestions}
              isVisible={showSuggestions}
            />

            {error && <ErrorMessage message={error} onRetry={retryOperation} />}

            {currentTrack && (
              <CurrentTrack
                track={currentTrack}
                isPlaying={playerState.isPlaying}
              />
            )}

            {hasSearched && (
              <SearchResults
                results={searchResults}
                onPlayAudio={handlePlayAudio}
                isLoading={isSearching}
                searchTerm={query}
              />
            )}

            <Recommendations
              recommendations={recommendations}
              onPlayAudio={handlePlayAudio}
              isLoading={isLoadingRecommendations}
              title={hasSearched ? "Related Videos" : "Trending Now"}
            />
          </div>
        </main>

        <div
          ref={playerRef}
          className="fixed -top-96 -left-96 w-0 h-0 overflow-hidden opacity-0 pointer-events-none"
        />

        {playerState.isReady && currentTrack && (
          <AudioPlayer
            mode={showPlayerPopup ? "popup" : "mini"}
            playerState={playerState}
            track={currentTrack}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            onSeek={seekTo}
            onClose={() => setShowPlayerPopup(false)}
            onExpand={() => setShowPlayerPopup(true)}
            suggestions={recommendations}
            onPlaySuggestion={handlePlayAudio}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </div>
      <InstallButton />
    </div>
  );
}

export default App;
