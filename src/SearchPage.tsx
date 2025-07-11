// import React, { useState, useEffect } from "react";
// import { Headphones, Move3d, MoveLeft } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { SearchBar } from "./components/SearchBar";
// import { SearchSuggestions } from "./components/SearchSuggestions";
// import { SearchResults } from "./components/SearchResults";
// import { AudioPlayer } from "./components/AudioPlayer";
// import { CurrentTrack } from "./components/CurrentTrack";
// import { Recommendations } from "./components/Recommendations";
// import { ErrorMessage } from "./components/ErrorMessage";
// import { InstallButton } from "./components/InstallButton";

// import { useYouTubePlayer } from "./hooks/useYouTubePlayer";
// import { useDebounce } from "./hooks/useDebounce";

// import {
//   searchVideos,
//   getSearchSuggestions,
//   getTrendingVideos,
//   getRelatedVideos,
// } from "./api/youtubeApi";

// import { VideoResult, SearchSuggestion } from "./types";
// import { db } from "./firebase";
// import {
//   initCache,
//   getCache,
//   setCache,
//   fetchFromCache,
//   preloadFirestoreCache,
// } from "./utils/cache";
// import Leftarrow from "./navbar/leftarrow";

// function SearchPage() {
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const q = params.get("q");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (q) {
//       setQuery(q);
//       handleSearch(q);
//     }
//   }, [q]);

//   const [showPlayerPopup, setShowPlayerPopup] = useState(false);
//   const [query, setQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<VideoResult[]>([]);
//   const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
//   const [recommendations, setRecommendations] = useState<VideoResult[]>([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
//   const [isLoadingRecommendations, setIsLoadingRecommendations] =
//     useState(true);
//   const [hasSearched, setHasSearched] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const debouncedQuery = useDebounce(query, 400);

//   const {
//     playerRef,
//     playerState,
//     currentTrack,
//     playVideo,
//     pauseVideo,
//     resumeVideo,
//     stopVideo,
//     seekTo,
//     onVideoEnd,
//   } = useYouTubePlayer();

//   // 🌐 Init Firebase cache on first load

//   useEffect(() => {
//     initCache(db);
//     preloadFirestoreCache(); // preload all data once
//   }, []);

//   useEffect(() => {
//     onVideoEnd(() => {
//       if (!currentTrack) return;
//       const index = recommendations.findIndex((v) => v.id === currentTrack.id);
//       const next = recommendations[index + 1];
//       if (next) {
//         playVideo(next.id, next.title, next.channel, next.thumbnail);
//       }
//     });
//   }, [currentTrack, recommendations]);

//   const handleNext = () => {
//     if (!currentTrack || recommendations.length === 0) return;
//     const currentIndex = recommendations.findIndex(
//       (v) => v.id === currentTrack.id
//     );
//     const nextIndex = (currentIndex + 1) % recommendations.length;
//     const nextVideo = recommendations[nextIndex];
//     playVideo(
//       nextVideo.id,
//       nextVideo.title,
//       nextVideo.channel,
//       nextVideo.thumbnail
//     );
//   };

//   const handlePrev = () => {
//     if (!currentTrack || recommendations.length === 0) return;
//     const currentIndex = recommendations.findIndex(
//       (v) => v.id === currentTrack.id
//     );
//     const prevIndex =
//       (currentIndex - 1 + recommendations.length) % recommendations.length;
//     const prevVideo = recommendations[prevIndex];
//     playVideo(
//       prevVideo.id,
//       prevVideo.title,
//       prevVideo.channel,
//       prevVideo.thumbnail
//     );
//   };

//   const handleSuggestionPlay = async (suggestion: SearchSuggestion) => {
//     setShowSuggestions(false);

//     // 🔍 Real search triggered
//     setQuery(suggestion.title);
//     setIsSearching(true);
//     setHasSearched(true);
//     setError(null);

//     try {
//       const searchKey = `search_${suggestion.title}`;
//       const cached = await fetchFromCache(searchKey);
//       const results = cached || (await searchVideos(suggestion.title, 12));
//       if (!cached) setCache(searchKey, results);

//       const safeResults = Array.isArray(results)
//         ? results
//         : Object.values(results || {});
//       setSearchResults(safeResults);

//       if (safeResults.length > 0) {
//         const relatedKey = `related_${results[0].id}`;
//         const relatedCached = await fetchFromCache(relatedKey);
//         const relatedRaw =
//           relatedCached || (await getRelatedVideos(results[0].id, 8));
//         const related = Array.isArray(relatedRaw)
//           ? relatedRaw
//           : Object.values(relatedRaw || {});
//         if (!relatedCached) setCache(relatedKey, related);
//         setRecommendations(related);
//       }
//     } catch (err) {
//       console.error("Error in suggestion-triggered search:", err);
//       setError("Failed to load related content from suggestion.");
//       setSearchResults([]);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   useEffect(() => {
//     const loadTrendingVideos = async () => {
//       setIsLoadingRecommendations(true);
//       try {
//         const cacheKey = "trending";
//         const cached = await fetchFromCache(cacheKey);
//         const trendingRaw = cached || (await getTrendingVideos(8));
//         const trending = Array.isArray(trendingRaw)
//           ? trendingRaw
//           : Object.values(trendingRaw || {});
//         if (!cached) setCache(cacheKey, trending);
//         setRecommendations(trending);
//         setError(null);
//       } catch (err) {
//         console.error("Error loading trending videos:", err);
//         setError(
//           "Failed to load trending videos. Please check your internet connection."
//         );
//       } finally {
//         setIsLoadingRecommendations(false);
//       }
//     };
//     loadTrendingVideos();
//   }, []);

//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       if (debouncedQuery.length >= 2 && showSuggestions) {
//         setIsLoadingSuggestions(true);
//         try {
//           const cacheKey = `suggestions_${debouncedQuery}`;
//           const cached = await fetchFromCache(cacheKey);
//           const resultRaw =
//             cached ||
//             (await getSearchSuggestions(`${debouncedQuery} songs`, 7));
//           const result = Array.isArray(resultRaw)
//             ? resultRaw
//             : Object.values(resultRaw || {});

//           if (!cached) setCache(cacheKey, result);
//           setSuggestions(result);
//           setError(null);
//         } catch (err) {
//           console.error("Error fetching suggestions:", err);
//           setSuggestions([]);
//         } finally {
//           setIsLoadingSuggestions(false);
//         }
//       } else {
//         setSuggestions([]);
//         setIsLoadingSuggestions(false);
//       }
//     };
//     fetchSuggestions();
//   }, [debouncedQuery, showSuggestions]);

//   const handleQueryChange = (newQuery: string) => {
//     setQuery(newQuery);
//     setShowSuggestions(newQuery.length > 0);
//   };

//   const handleSearch = async (searchQuery: string) => {
//     setIsSearching(true);
//     setHasSearched(true);
//     setShowSuggestions(false);
//     setError(null);
//     try {
//       const searchKey = `search_${searchQuery}`;
//       const cached = await fetchFromCache(searchKey);
//       const results = cached || (await searchVideos(searchQuery, 12));
//       if (!cached) setCache(searchKey, results);

//       const safeResults = Array.isArray(results)
//         ? results
//         : Object.values(results || {});
//       setSearchResults(safeResults);

//       if (safeResults.length > 0) {
//         const relatedKey = `related_${results[0].id}`;
//         const relatedCached = await fetchFromCache(relatedKey);
//         const relatedRaw =
//           relatedCached || (await getRelatedVideos(results[0].id, 8));
//         const related = Array.isArray(relatedRaw)
//           ? relatedRaw
//           : Object.values(relatedRaw || {});
//         if (!relatedCached) setCache(relatedKey, related);
//         setRecommendations(related);
//       }
//     } catch (err) {
//       console.error("Error searching videos:", err);
//       setError("Sorry, the server is busy. Please try again later.");
//       setSearchResults([]);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const handlePlayAudio = (video: VideoResult | SearchSuggestion) => {
//     setShowSuggestions(false);
//     playVideo(video.id, video.title, video.channel, video.thumbnail);
//   };

//   const handlePlay = () => {
//     if (currentTrack && playerState.isReady) {
//       if (playerState.isPaused) {
//         resumeVideo();
//       } else if (playerState.isStopped) {
//         playVideo(
//           currentTrack.id,
//           currentTrack.title,
//           currentTrack.channel,
//           currentTrack.thumbnail
//         );
//       }
//     }
//   };

//   const handlePause = () => {
//     if (playerState.isPlaying) {
//       pauseVideo();
//     }
//   };

//   const handleStop = () => {
//     stopVideo();
//   };

//   const retryOperation = () => {
//     setError(null);
//     if (hasSearched && query) {
//       handleSearch(query);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black">
//       <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-20"></div>
//       <div className="relative z-10">
//         <header className="pt-8 pb-6 px-4">
//           <div className="max-w-6xl mx-auto">
//             <Leftarrow />
//             <div className="flex items-center justify-center mb-2">
//               <div className="flex items-center space-x-3">
//                 <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-3 shadow-lg select-none">
//                   <img
//                     src="/icon.svg"
//                     alt=""
//                     className="h-10 w-10"
//                     draggable="false"
//                   />
//                 </div>
//                 <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
//                   Yotify
//                 </h1>
//               </div>
//             </div>
//             <div className="text-center text-gray-400 mb-8">
//               <div className="flex items-center justify-center space-x-2">
//                 <Headphones className="h-4 w-4" />
//                 <span>Stream YouTube audio with style (No Ads)</span>
//               </div>
//               <div>- SB</div>
//             </div>
//           </div>
//         </header>

//         <main className="px-4 pb-24">
//           <div className="max-w-6xl mx-auto">
//             <SearchBar
//               onSearch={handleSearch}
//               onQueryChange={handleQueryChange}
//               isLoading={isSearching}
//               query={query}
//             />

//             <SearchSuggestions
//               suggestions={suggestions}
//               onPlayAudio={handlePlayAudio}
//               isLoading={isLoadingSuggestions}
//               isVisible={showSuggestions}
//             />

//             {error && <ErrorMessage message={error} onRetry={retryOperation} />}

//             {currentTrack && (
//               <CurrentTrack
//                 track={currentTrack}
//                 isPlaying={playerState.isPlaying}
//               />
//             )}

//             {hasSearched && (
//               <SearchResults
//                 results={searchResults}
//                 onPlayAudio={handlePlayAudio}
//                 isLoading={isSearching}
//                 searchTerm={query}
//               />
//             )}

//             <Recommendations
//               recommendations={recommendations}
//               onPlayAudio={handlePlayAudio}
//               isLoading={isLoadingRecommendations}
//               title={hasSearched ? "Related Videos" : "Trending Now"}
//             />
//           </div>
//         </main>

//         <div
//           ref={playerRef}
//           className="fixed -top-96 -left-96 w-0 h-0 overflow-hidden opacity-0 pointer-events-none"
//         />

//         {playerState.isReady && currentTrack && (
//           <AudioPlayer
//             mode={showPlayerPopup ? "popup" : "mini"}
//             playerState={playerState}
//             track={currentTrack}
//             onPlay={handlePlay}
//             onPause={handlePause}
//             onStop={handleStop}
//             onSeek={seekTo}
//             onClose={() => setShowPlayerPopup(false)}
//             onExpand={() => setShowPlayerPopup(true)}
//             suggestions={recommendations}
//             onPlaySuggestion={handlePlayAudio}
//             onNext={handleNext}
//             onPrev={handlePrev}
//           />
//         )}

//         <SearchSuggestions
//           suggestions={suggestions}
//           onPlayAudio={handleSuggestionPlay} // ✅ NEW
//           isLoading={isLoadingSuggestions}
//           isVisible={showSuggestions}
//         />
//       </div>
//       <InstallButton />
//     </div>
//   );
// }

// export default SearchPage;

import React, { useState, useEffect } from "react";
import {
  Headphones,
  ArrowLeft,
  Search as SearchIcon,
  Loader2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
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

function SearchPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const q = params.get("q");
  const navigate = useNavigate();

  useEffect(() => {
    if (q) {
      setQuery(q);
      handleSearch(q);
    }
  }, [q]);

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

  const handleSuggestionPlay = async (suggestion: SearchSuggestion) => {
    setShowSuggestions(false);

    // 🔍 Real search triggered
    setQuery(suggestion.title);
    setIsSearching(true);
    setHasSearched(true);
    setError(null);

    try {
      const searchKey = `search_${suggestion.title}`;
      const cached = await fetchFromCache(searchKey);
      const results = cached || (await searchVideos(suggestion.title, 12));
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
      console.error("Error in suggestion-triggered search:", err);
      setError("Failed to load related content from suggestion.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
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
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Animated Background - Consistent with Home */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(139,92,246,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(16,185,129,0.05),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        {/* Professional Header */}
        <header className="pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <div className="mb-4 sm:mb-6">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center space-x-2 sm:space-x-3 text-slate-400 hover:text-white transition-colors duration-300"
              >
                <div className="p-2 sm:p-2.5 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 group-hover:border-purple-500/50 transition-all duration-300">
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <span className="text-sm sm:text-base font-medium hidden sm:inline">
                  Back
                </span>
              </button>
            </div>

            {/* Logo Section */}
            <div className="flex flex-col items-center mb-6 sm:mb-8">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                <div className="relative">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 lg:p-4 shadow-2xl">
                    <img src="/icon.svg" alt="" />
                  </div>
                  {/* <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" /> */}
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Yotify
                </h1>
              </div>

              <div className="text-center text-slate-400">
                <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Stream YouTube audio with style — No Ads</span>
                </div>
                <p className="text-xs mt-1 text-slate-500">
                  Professional Music Streaming
                </p>
              </div>
            </div>

            {/* Enhanced Search Bar Container */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <SearchBar
                  onSearch={handleSearch}
                  onQueryChange={handleQueryChange}
                  isLoading={isSearching}
                  query={query}
                />

                {/* Search Loading Indicator */}
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 pb-24 sm:pb-32">
          <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
            {/* Search Suggestions */}
            <SearchSuggestions
              suggestions={suggestions}
              onPlayAudio={handlePlayAudio}
              isLoading={isLoadingSuggestions}
              isVisible={showSuggestions}
            />

            {/* Error Message */}
            {error && (
              <div className="max-w-2xl mx-auto">
                <ErrorMessage message={error} onRetry={retryOperation} />
              </div>
            )}

            {/* Current Track Display */}
            {currentTrack && (
              <div className="max-w-4xl mx-auto">
                <CurrentTrack
                  track={currentTrack}
                  isPlaying={playerState.isPlaying}
                />
              </div>
            )}

            {/* Search Results Section */}
            {hasSearched && (
              <section>
                <div className="flex items-center space-x-3 mb-6 sm:mb-8">
                  <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    Search Results
                    {query && (
                      <span className="text-slate-400 font-normal text-base sm:text-lg ml-2">
                        for "{query}"
                      </span>
                    )}
                  </h2>
                </div>

                <SearchResults
                  results={searchResults}
                  onPlayAudio={handlePlayAudio}
                  isLoading={isSearching}
                  searchTerm={query}
                />
              </section>
            )}

            {/* Recommendations Section */}
            <section>
              <div className="flex items-center space-x-3 mb-6 sm:mb-8">
                <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  {hasSearched ? "Related Videos" : "Trending Now"}
                </h2>
              </div>

              <Recommendations
                recommendations={recommendations}
                onPlayAudio={handlePlayAudio}
                isLoading={isLoadingRecommendations}
                title={hasSearched ? "Related Videos" : "Trending Now"}
              />
            </section>
          </div>
        </main>

        {/* Hidden YouTube Player */}
        <div
          ref={playerRef}
          className="fixed -top-96 -left-96 w-0 h-0 overflow-hidden opacity-0 pointer-events-none"
        />

        {/* Audio Player */}
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

        {/* Additional Search Suggestions */}
        <SearchSuggestions
          suggestions={suggestions}
          onPlayAudio={handleSuggestionPlay}
          isLoading={isLoadingSuggestions}
          isVisible={showSuggestions}
        />
      </div>

      {/* Install Button */}
      <InstallButton />
    </div>
  );
}

export default SearchPage;
