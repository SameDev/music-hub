import { Pause, Play } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import { getCoverUrl } from '../../lib/mediaUrl';
import { formatDuration } from '../../lib/formatDuration';

export function PlayerBar() {
  const { currentTrack, isPlaying, currentTime, duration, togglePlay, seek } = usePlayer();

  if (!currentTrack) return null;

  const coverUrl = getCoverUrl(currentTrack.coverPath);

  return (
    <div className="flex h-16 items-center gap-4 border-t border-surface-border bg-surface-raised px-5">
      <div className="flex w-56 items-center gap-3 overflow-hidden">
        {coverUrl ? (
          <img src={coverUrl} alt="" className="h-10 w-10 shrink-0 rounded object-cover" />
        ) : (
          <div className="h-10 w-10 shrink-0 rounded bg-surface" />
        )}
        <div className="min-w-0">
          <div className="truncate text-sm text-slate-100">{currentTrack.title}</div>
          <div className="truncate text-xs text-slate-500">{currentTrack.artistName}</div>
        </div>
      </div>

      <button
        type="button"
        onClick={togglePlay}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>

      <span className="w-10 text-right text-xs text-slate-500">{formatDuration(Math.floor(currentTime))}</span>
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={(e) => seek(Number(e.target.value))}
        className="h-1 flex-1 accent-accent"
      />
      <span className="w-10 text-xs text-slate-500">{formatDuration(Math.floor(duration))}</span>
    </div>
  );
}
