import { ChevronDown, Pause, Play, Volume1, Volume2, VolumeX } from 'lucide-react';
import { usePlayer } from '../../contexts/PlayerContext';
import { getCoverUrl } from '../../lib/mediaUrl';
import { formatDuration } from '../../lib/formatDuration';

export function FullscreenPlayer() {
  const { currentTrack, isPlaying, currentTime, duration, volume, isFullscreen, togglePlay, seek, setVolume, closeFullscreen } =
    usePlayer();

  if (!isFullscreen || !currentTrack) return null;

  const coverUrl = getCoverUrl(currentTrack.coverPath);
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-surface text-slate-100">
      {coverUrl && (
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center opacity-30 blur-3xl"
          style={{ backgroundImage: `url(${coverUrl})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-surface/40 via-surface/80 to-surface" />

      <div className="relative flex items-center justify-between p-4 sm:p-6">
        <button
          type="button"
          onClick={closeFullscreen}
          aria-label="Minimizar"
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ChevronDown size={22} />
        </button>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-6 px-6 pb-6">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt=""
            className="aspect-square w-full max-w-[280px] rounded-lg object-cover shadow-2xl sm:max-w-sm md:max-w-md"
          />
        ) : (
          <div className="aspect-square w-full max-w-[280px] rounded-lg bg-surface-raised shadow-2xl sm:max-w-sm md:max-w-md" />
        )}

        <div className="w-full max-w-md text-center">
          <h1 className="truncate text-xl font-semibold text-slate-50 sm:text-2xl">{currentTrack.title}</h1>
          <p className="mt-1 truncate text-sm text-slate-400 sm:text-base">
            {currentTrack.artistName} · {currentTrack.albumTitle}
          </p>
        </div>

        <div className="w-full max-w-md">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="h-1 w-full accent-accent"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-500">
            <span>{formatDuration(Math.floor(currentTime))}</span>
            <span>{formatDuration(Math.floor(duration))}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={togglePlay}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-colors hover:bg-accent-hover"
        >
          {isPlaying ? <Pause size={26} /> : <Play size={26} className="translate-x-0.5" />}
        </button>

        <div className="flex w-full max-w-[200px] items-center gap-2 text-slate-400">
          <VolumeIcon size={16} />
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
      </div>
    </div>
  );
}
