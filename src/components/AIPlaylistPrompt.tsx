// src/components/AIPlaylistPrompt.tsx
import React, { useState } from "react";
import { Sparkles, Loader } from "lucide-react";

interface AIPlaylistPromptProps {
  onGenerate: (prompt: string) => void;
  loading: boolean;
}

export const AIPlaylistPrompt: React.FC<AIPlaylistPromptProps> = ({
  onGenerate,
  loading,
}) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) onGenerate(prompt.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col md:flex-row gap-3"
    >
      <input
        type="text"
        placeholder="Describe your mood or vibe (e.g. chill coding music)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="flex-1 px-4 py-3 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        disabled={loading}
      />
      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 disabled:opacity-50"
        disabled={loading || !prompt.trim()}
      >
        {loading ? (
          <Loader className="animate-spin h-5 w-5" />
        ) : (
          <Sparkles className="h-5 w-5" />
        )}
        Generate
      </button>
    </form>
  );
};
