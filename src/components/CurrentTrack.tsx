import React from 'react';
import { Music, Users } from 'lucide-react';
import { CurrentTrack as CurrentTrackType } from '../types';

interface CurrentTrackProps {
  track: CurrentTrackType | null;
  isPlaying: boolean;
}

export const CurrentTrack: React.FC<CurrentTrackProps> = ({ track, isPlaying }) => {
  if (!track) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 mb-8">
        <div className="flex items-center justify-center h-32 text-gray-400">
          <div className="text-center">
            <Music className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg">No track selected</p>
            <p className="text-sm opacity-75">Search and play a song to get started</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 mb-8 shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-20 h-20 rounded-lg object-cover shadow-lg"
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-purple-400 rounded-full animate-pulse"></div>
                <div className="w-1 h-6 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-4 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg mb-1 truncate">
            {track.title}
          </h3>
          <div className="flex items-center text-gray-400 text-sm">
            <Users className="h-4 w-4 mr-1" />
            <span className="truncate">{track.channel}</span>
          </div>
          <div className="flex items-center mt-2">
            <div className="text-xs text-purple-400 font-medium">
              {isPlaying ? '♪ Now Playing' : '⏸ Paused'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};