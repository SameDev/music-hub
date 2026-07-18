import { authStorage } from './authStorage';
import { getApiUrl } from './apiUrl';

export function getStreamUrl(trackId: string): string {
  const token = authStorage.getAccessToken() ?? '';
  return `${getApiUrl()}/library/tracks/${trackId}/stream?token=${encodeURIComponent(token)}`;
}

export function getCoverUrl(coverPath: string | null | undefined): string | null {
  if (!coverPath) return null;
  const filename = coverPath.split('/').pop();
  if (!filename) return null;
  const token = authStorage.getAccessToken() ?? '';
  return `${getApiUrl()}/library/covers/${filename}?token=${encodeURIComponent(token)}`;
}
