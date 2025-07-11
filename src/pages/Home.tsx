import React from "react";
import {
  Headphones,
  Search as SearchIcon,
  Play,
  Music,
  Globe,
  Film,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InstallButton } from "../components/InstallButton";

const languages = [
  {
    name: "हिन्दी",
    value: "hi",
    font: "Noto Sans Devanagari",
    color: "from-orange-500 to-red-500",
  },
  { name: "English", value: "en", color: "from-blue-500 to-indigo-500" },
  {
    name: "ਪੰਜਾਬੀ",
    value: "pa",
    font: "Noto Sans Gurmukhi",
    color: "from-yellow-500 to-orange-500",
  },
  {
    name: "मराठी",
    value: "mr",
    font: "Noto Sans Devanagari",
    color: "from-green-500 to-teal-500",
  },
  {
    name: "বাংলা",
    value: "bn",
    font: "Noto Sans Bengali",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "தமிழ்",
    value: "ta",
    font: "Noto Sans Tamil",
    color: "from-red-500 to-rose-500",
  },
  {
    name: "తెలుగు",
    value: "te",
    font: "Noto Sans Telugu",
    color: "from-indigo-500 to-purple-500",
  },
  {
    name: "ಕನ್ನಡ",
    value: "kn",
    font: "Noto Sans Kannada",
    color: "from-teal-500 to-cyan-500",
  },
];

const industries = [
  {
    name: "Bollywood",
    query: "Bollywood songs",
    icon: Music,
    color: "from-pink-500 to-rose-500",
  },
  {
    name: "Hollywood",
    query: "Hollywood songs",
    icon: Film,
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "Tollywood",
    query: "Tollywood songs",
    icon: Play,
    color: "from-yellow-500 to-orange-500",
  },
  {
    name: "Kollywood",
    query: "Kollywood songs",
    icon: Music,
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Nollywood",
    query: "Nollywood songs",
    icon: Film,
    color: "from-purple-500 to-violet-500",
  },
  {
    name: "K-Pop",
    query: "K-pop songs",
    icon: Globe,
    color: "from-cyan-500 to-blue-500",
  },
];

export const Home = () => {
  const navigate = useNavigate();
  const handleClick = (query: string) => {
    console.log(`Searching for: ${query}`);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSearchClick = () => {
    console.log("Opening search");
    navigate("/search");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(139,92,246,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(16,185,129,0.05),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="pt-4 sm:pt-8 lg:pt-12 pb-4 sm:pb-6 lg:pb-8 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="relative">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 lg:p-4 shadow-2xl">
                    <img src="/icon.svg" alt="" />
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Yotify
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm font-medium mt-0.5 sm:mt-1 hidden sm:block">
                    Professional Music Streaming
                  </p>
                </div>
              </div>

              <button
                onClick={handleSearchClick}
                className="group flex items-center bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-sm border border-slate-700 hover:border-purple-500/50 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
              >
                <SearchIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <span className="font-medium text-sm sm:text-base ml-2 hidden sm:inline">
                  Search Music
                </span>
              </button>
            </div>

            {/* Hero Section */}
            <div className="text-center py-6 sm:py-8 lg:py-12">
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent leading-tight duration-3000 ease-in-out">
                Stream Without Limits
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-slate-400 mb-6 sm:mb-8 max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-4">
                Experience high-quality Yt audio streaming with zero
                advertisements. Discover music across languages and industries
                with our premium platform.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-slate-500">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm">Ad-Free Experience</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-slate-600 rounded-full" />
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm">High Quality Audio</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-slate-600 rounded-full" />
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  <span className="text-xs sm:text-sm">
                    Global Music Library
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 pb-16 sm:pb-20 lg:pb-24">
          <div className="max-w-7xl mx-auto space-y-12 sm:space-y-14 lg:space-y-16">
            {/* Languages Section */}
            <section>
              <div className="flex items-center space-x-3 mb-6 sm:mb-8">
                <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Explore by Language
                </h2>
              </div>
              <p className="text-slate-400 mb-6 sm:mb-8 text-base sm:text-lg">
                Discover music in your native language from around the world
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => handleClick(`${lang.name} songs`)}
                    style={{ fontFamily: lang.font }}
                    className="group relative overflow-hidden p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${lang.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    <div className="relative z-10">
                      <div className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 sm:mb-2">
                        {lang.name}
                      </div>
                      <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                        Explore Music
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Industries Section */}
            <section>
              <div className="flex items-center space-x-3 mb-6 sm:mb-8">
                <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Explore by Industry
                </h2>
              </div>
              <p className="text-slate-400 mb-6 sm:mb-8 text-base sm:text-lg">
                Browse music from the world's biggest entertainment industries
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {industries.map((ind) => {
                  const IconComponent = ind.icon;
                  return (
                    <button
                      key={ind.name}
                      onClick={() => handleClick(ind.query)}
                      className="group relative overflow-hidden p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${ind.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                      />
                      <div className="relative z-10">
                        <div className="flex items-center justify-center mb-2 sm:mb-3">
                          <div
                            className={`p-2 sm:p-2.5 lg:p-3 rounded-full bg-gradient-to-r ${ind.color} shadow-lg`}
                          >
                            <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                          </div>
                        </div>
                        <div className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 sm:mb-2">
                          {ind.name}
                        </div>
                        <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                          Popular Hits
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Premium Features Section */}
            <section className="bg-gradient-to-r from-slate-800/30 to-slate-700/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-slate-700/50">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <div className="p-3 sm:p-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-2xl">
                    <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4">
                  Premium Experience
                </h3>
                <p className="text-slate-400 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
                  Enjoy uninterrupted music streaming with crystal-clear audio
                  quality, personalized recommendations, and access to millions
                  of tracks worldwide.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-400 mb-2">
                      0
                    </div>
                    <div className="text-slate-400 text-sm sm:text-base">
                      Advertisements
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-400 mb-2">
                      Best
                    </div>
                    <div className="text-slate-400 text-sm sm:text-base">
                      Audio Quality
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-400 mb-2">
                      ∞
                    </div>
                    <div className="text-slate-400 text-sm sm:text-base">
                      Music Library
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      <InstallButton />
    </div>
  );
};
