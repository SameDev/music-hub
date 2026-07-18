import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { apiFetch } from '../lib/api';
import { getStreamUrl } from '../lib/mediaUrl';

export interface PlayableTrack {
  id: string;
  title: string;
  artistName: string;
  albumTitle: string;
  coverPath: string | null;
}

interface PlayerContextValue {
  currentTrack: PlayableTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isFullscreen: boolean;
  play: (track: PlayableTrack) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  openFullscreen: () => void;
  closeFullscreen: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState<PlayableTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  const play = useCallback((track: PlayableTrack) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set src and call play() synchronously in the same click-derived call stack — the browser's
    // autoplay policy ties programmatic playback to the user gesture that triggered it. Doing this
    // via a React-rendered `src` prop + `autoPlay` attribute breaks that link (the DOM update lands
    // on a later task than the click) and silently fails to start playback.
    audio.src = getStreamUrl(track.id);
    audio.currentTime = 0;
    void audio.play();

    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);
    void apiFetch<void>(`/library/tracks/${track.id}/play`, { method: 'POST' }).catch(() => undefined);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((next: number) => {
    setVolumeState(Math.min(1, Math.max(0, next)));
  }, []);

  const openFullscreen = useCallback(() => setIsFullscreen(true), []);
  const closeFullscreen = useCallback(() => setIsFullscreen(false), []);

  const value = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      isFullscreen,
      play,
      togglePlay,
      seek,
      setVolume,
      openFullscreen,
      closeFullscreen,
    }),
    [currentTrack, isPlaying, currentTime, duration, volume, isFullscreen, play, togglePlay, seek, setVolume, openFullscreen, closeFullscreen],
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return ctx;
}
