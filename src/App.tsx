import React, { useState, useEffect } from "react";
import { Library } from "./components/Library";
import { Music2, Headphones } from "lucide-react";
import { SearchBar } from "./components/SearchBar";
import { SearchSuggestions } from "./components/SearchSuggestions";
import { SearchResults } from "./components/SearchResults";
import { AudioPlayer } from "./components/AudioPlayer";
import { CurrentTrack } from "./components/CurrentTrack";
import { Recommendations } from "./components/Recommendations";
import { ErrorMessage } from "./components/ErrorMessage";
import { useYouTubePlayer } from "./hooks/useYouTubePlayer";
import { useDebounce } from "./hooks/useDebounce";
import { AIPlaylistPrompt } from "./components/AIPlaylistPrompt";
import { InstallButton } from "./components/InstallButton";

import {
  searchVideos,
  getSearchSuggestions,
  getTrendingVideos,
  getRelatedVideos,
} from "./api/youtubeApi";
import { generatePlaylist } from "./api/geminiClient";
import { VideoResult, SearchSuggestion } from "./types";
import { AudioPlayerPopup } from "./components/AudioPlayerPopup";

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
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

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

  const {
    playerRef,
    playerState,
    currentTrack,
    playVideo,
    pauseVideo,
    resumeVideo,
    stopVideo,
    setVolume,
    seekTo,
  } = useYouTubePlayer();

  useEffect(() => {
    const loadTrendingVideos = async () => {
      setIsLoadingRecommendations(true);
      try {
        const trending = await getTrendingVideos(8);
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
          const suggestionResults = await getSearchSuggestions(
            `${debouncedQuery} songs`,
            5
          );
          setSuggestions(suggestionResults);
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
      const results = await searchVideos(searchQuery, 12);
      setSearchResults(results);
      if (results.length > 0) {
        const related = await getRelatedVideos(results[0].id, 8);
        setRecommendations(related);
      }
    } catch (err) {
      console.error("Error searching videos:", err);
      setError("Sorry Server is busy please try again later");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGeneratePlaylist = async (prompt: string) => {
    setIsGeneratingAI(true);
    try {
      const results = await generatePlaylist(prompt);
      setSearchResults(results);
      setHasSearched(true);
      setQuery(prompt);
    } catch (err) {
      console.error("AI Playlist Error:", err);
      setError("Failed to generate playlist. Please try again.");
    } finally {
      setIsGeneratingAI(false);
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

  const handleVolumeChange = (volume: number) => {
    setVolume(volume);
  };

  const retryOperation = () => {
    setError(null);
    if (hasSearched && query) {
      handleSearch(query);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.03%22%3E%3Cpath d=%22m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      <div className="relative z-10">
        <header className="pt-8 pb-6 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-3 shadow-lg">
                  <img src="/icon.svg" alt="" className="h-10 w-10" />
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

            {/* <AIPlaylistPrompt
              onGenerate={handleGeneratePlaylist}
              loading={isGeneratingAI}
            /> */}

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
            onNext={handleNext} // ✅ NEW
            onPrev={handlePrev} // ✅ NEW
          />
        )}

        {/* {showPlayerPopup && currentTrack && (
          <AudioPlayerPopup
            playerState={playerState}
            track={currentTrack}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            onSeek={seekTo}
            onClose={() => setShowPlayerPopup(false)}
            suggestions={recommendations}
            onPlaySuggestion={handlePlayAudio}
          />
        )} */}
      </div>
      <InstallButton />
    </div>
  );
}

export default App;
