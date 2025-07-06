export interface VideoResult {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  duration: string;
  views: string;
  publishedAt?: string;
}

export interface PlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  isStopped: boolean;
  isReady: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

export interface CurrentTrackInfo {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}

export interface SearchSuggestion {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
}

export interface ApiError {
  message: string;
  code?: string;
}