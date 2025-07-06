import { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerState, CurrentTrackInfo } from '../types';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export const useYouTubePlayer = () => {
  const playerInstance = useRef<any | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    isPaused: false,
    isStopped: true,
    isReady: false,
    currentTime: 0,
    duration: 0,
    volume: 100,
  });

  const [currentTrack, setCurrentTrack] = useState<CurrentTrackInfo | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayerReady = useRef(false); // prevent multiple setups

  const loadYouTubeAPI = useCallback(() => {
    if (window.YT && window.YT.Player) return;

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      console.log('YouTube IFrame API script tag added.');
    }
  }, []);

  const startProgressInterval = useCallback(() => {
    stopProgressInterval();
    intervalRef.current = setInterval(() => {
      if (playerInstance.current && typeof playerInstance.current.getCurrentTime === 'function') {
        setPlayerState(prev => ({
          ...prev,
          currentTime: playerInstance.current.getCurrentTime() || 0,
          duration: playerInstance.current.getDuration() || 0,
        }));
      }
    }, 1000);
  }, [playerState.isPlaying]);

  const stopProgressInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const initializePlayer = useCallback(() => {
    if (!playerRef.current || playerInstance.current || !window.YT?.Player || isPlayerReady.current) return;

    console.log('Initializing new YouTube Player instance...');
    isPlayerReady.current = true;

    playerInstance.current = new window.YT.Player(playerRef.current, {
      height: '0',
      width: '0',
      playerVars: {
        controls: 0,
        disablekb: 1,
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        enablejsapi: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: () => {
          console.log('YouTube player ready! (onReady)');
          const player = playerInstance.current;

          if (player && typeof player.setVolume === 'function') {
            player.setVolume(playerState.volume);
            const currentVolume = player.getVolume?.() ?? playerState.volume;

            setPlayerState(prev => ({
              ...prev,
              isReady: true,
              volume: currentVolume,
            }));
          }
        },
        onStateChange: (event: any) => {
          const state = event.data;
          console.log('Player state changed to:', state);
          setPlayerState(prev => {
            const newState = { ...prev };
            switch (state) {
              case window.YT.PlayerState.PLAYING:
                newState.isPlaying = true;
                newState.isPaused = false;
                newState.isStopped = false;
                startProgressInterval();
                break;
              case window.YT.PlayerState.PAUSED:
                newState.isPlaying = false;
                newState.isPaused = true;
                newState.isStopped = false;
                stopProgressInterval();
                break;
              case window.YT.PlayerState.ENDED:
                newState.isPlaying = false;
                newState.isPaused = false;
                newState.isStopped = true;
                newState.currentTime = 0;
                stopProgressInterval();
                setCurrentTrack(null);
                break;
              case window.YT.PlayerState.BUFFERING:
                newState.isPlaying = false;
                break;
              case window.YT.PlayerState.CUED:
                newState.isPlaying = false;
                newState.isPaused = false;
                newState.isStopped = true;
                break;
              default:
                break;
            }
            return newState;
          });
        },
        onError: (error: any) => {
          console.error('YouTube Player Error:', error);
          setPlayerState(prev => ({
            ...prev,
            isPlaying: false,
            isPaused: false,
            isStopped: true,
          }));
          stopProgressInterval();
          setCurrentTrack(null);
        },
      },
    });
  }, [playerRef, playerState.volume]);

  useEffect(() => {
    loadYouTubeAPI();

    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube IFrame API is ready.');
      initializePlayer();
    };

    const waitForYT = () => {
      if (window.YT && window.YT.Player) {
        initializePlayer();
      } else {
        setTimeout(waitForYT, 100);
      }
    };
    waitForYT();

    return () => {
      if (playerInstance.current) {
        playerInstance.current.destroy();
        playerInstance.current = null;
        console.log('YouTube Player destroyed on unmount.');
      }

      stopProgressInterval();

      if (window.onYouTubeIframeAPIReady === initializePlayer) {
        delete window.onYouTubeIframeAPIReady;
      }

      const script = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (script) {
        script.remove();
        console.log('YouTube IFrame API script tag removed.');
      }

      isPlayerReady.current = false;
    };
  }, [loadYouTubeAPI, initializePlayer, stopProgressInterval]);

  const playVideo = useCallback((videoId: string, title: string, channel: string, thumbnail: string) => {
    if (playerInstance.current && playerState.isReady) {
      setCurrentTrack({ id: videoId, title, channel, thumbnail });
      playerInstance.current.loadVideoById(videoId);
      playerInstance.current.playVideo();
    } else {
      console.warn('Player not ready yet.');
    }
  }, [playerState.isReady]);

  const pauseVideo = useCallback(() => {
    if (playerInstance.current && playerState.isPlaying) {
      playerInstance.current.pauseVideo();
    }
  }, [playerState.isPlaying]);

  const resumeVideo = useCallback(() => {
    if (playerInstance.current && playerState.isPaused) {
      playerInstance.current.playVideo();
    }
  }, [playerState.isPaused]);

  const seekTo = useCallback((time: number) => {
    if (playerInstance.current && typeof playerInstance.current.seekTo === "function") {
      playerInstance.current.seekTo(time, true);
      setPlayerState(prev => ({ ...prev, currentTime: time }));
    }
  }, []);
  

  const stopVideo = useCallback(() => {
    if (playerInstance.current && !playerState.isStopped) {
      playerInstance.current.stopVideo();
      stopProgressInterval();
      setPlayerState(prev => ({
        ...prev,
        isPlaying: false, 
        isPaused: false,
        isStopped: true,
        currentTime: 0,
      }));
      setCurrentTrack(null);
    }
  }, [playerState.isStopped, stopProgressInterval]);

  const setVolume = useCallback((volume: number) => {
    const clamped = Math.max(0, Math.min(100, volume));
    setPlayerState(prev => ({ ...prev, volume: clamped }));

    if (playerInstance.current && typeof playerInstance.current.setVolume === 'function') {
      try {
        playerInstance.current.setVolume(clamped);
        console.log('Volume set to:', clamped);
      } catch (err) {
        console.warn('Error setting volume:', err);
      }
    } else {
      console.warn('setVolume not available yet.');
    }
  }, []);

  return {
    playerRef,
    playerState,
    currentTrack,
    playVideo,
    pauseVideo,
    resumeVideo,
    stopVideo,
    setVolume,
    seekTo
  };
};
