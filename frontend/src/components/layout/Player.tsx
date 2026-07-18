import { Maximize2, Pause, Play, Volume1, Volume2, VolumeX } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import { getCoverUrl } from '../../lib/mediaUrl';
import { formatDuration } from '../../lib/formatDuration';

export function PlayerBar() {
  const { currentTrack, isPlaying, currentTime, duration, volume, togglePlay, seek, setVolume, openFullscreen } =
    usePlayer();

  if (!currentTrack) return null;

  const coverUrl = getCoverUrl(currentTrack.coverPath);
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex h-16 items-center gap-2 border-t border-surface-border bg-surface-raised px-3 sm:gap-4 sm:px-5">
      <button
        type="button"
        onClick={openFullscreen}
        aria-label="Abrir player em tela cheia"
        className="flex w-24 min-w-0 items-center gap-2 overflow-hidden text-left sm:w-56 sm:gap-3"
      >
        {coverUrl ? (
          <img src={coverUrl} alt="" className="h-10 w-10 shrink-0 rounded object-cover" />
        ) : (
          <div className="h-10 w-10 shrink-0 rounded bg-surface" />
        )}
        <div className="min-w-0">
          <div className="truncate text-sm text-slate-100">{currentTrack.title}</div>
          <div className="truncate text-xs text-slate-500">{currentTrack.artistName}</div>
        </div>
      </button>

      <button
        type="button"
        onClick={togglePlay}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>

      <span className="hidden w-10 text-right text-xs text-slate-500 sm:inline">
        {formatDuration(Math.floor(currentTime))}
      </span>
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={(e) => seek(Number(e.target.value))}
        className="h-1 min-w-0 flex-1 accent-accent"
      />
      <span className="hidden w-10 text-xs text-slate-500 sm:inline">{formatDuration(Math.floor(duration))}</span>

      <div className="hidden w-24 items-center gap-1.5 text-slate-400 md:flex">
        <VolumeIcon size={15} />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="h-1 w-full accent-accent"
        />
      </div>

      <button
        type="button"
        onClick={openFullscreen}
        aria-label="Abrir player em tela cheia"
        className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/10 hover:text-white sm:flex"
      >
        <Maximize2 size={15} />
      </button>
    </div>
  );
}
