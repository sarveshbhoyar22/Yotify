import React, { createContext, useContext } from "react";
import { useYouTubePlayer } from "../hooks/useYouTubePlayer";

const PlayerContext = createContext<any>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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

  return (
    <PlayerContext.Provider
      value={{
        playerRef,
        playerState,
        currentTrack,
        playVideo,
        pauseVideo,
        resumeVideo,
        stopVideo,
        seekTo,
        onVideoEnd,
        isReady: playerState?.isReady,
      }}
    >
      <>
        <div
          ref={playerRef}
          id="yt-player"
          className="fixed -top-96 -left-96 w-0 h-0 overflow-hidden opacity-0 pointer-events-none"
        />
        {children}
      </>
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
