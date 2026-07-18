import { Injectable } from '@nestjs/common';
import { execFile } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { promisify } from 'node:util';
import { parseFile, type IAudioMetadata } from 'music-metadata';
import { WriteTagsDto } from './dto/write-tags.dto';

const execFileAsync = promisify(execFile);

@Injectable()
export class MetadataRepository {
  parseFile(filePath: string): Promise<IAudioMetadata> {
    return parseFile(filePath);
  }

  async saveCoverArt(coversDir: string, data: Uint8Array, format: string): Promise<string> {
    await mkdir(coversDir, { recursive: true });
    const ext = format.split('/')[1] ?? 'jpg';
    const fileName = `${randomUUID()}.${ext}`;
    const destPath = join(coversDir, fileName);
    await writeFile(destPath, data);
    return destPath;
  }

  async writeTagsWithFfmpeg(filePath: string, tags: Omit<WriteTagsDto, 'filePath'>): Promise<void> {
    const tmpPath = join(dirname(filePath), `.tmp-${randomUUID()}${extname(filePath)}`);

    const metadataArgs: string[] = [];
    if (tags.title !== undefined) metadataArgs.push('-metadata', `title=${tags.title}`);
    if (tags.artist !== undefined) metadataArgs.push('-metadata', `artist=${tags.artist}`);
    if (tags.album !== undefined) metadataArgs.push('-metadata', `album=${tags.album}`);
    if (tags.year !== undefined) metadataArgs.push('-metadata', `date=${tags.year}`);
    if (tags.genre !== undefined) metadataArgs.push('-metadata', `genre=${tags.genre}`);
    if (tags.trackNumber !== undefined) metadataArgs.push('-metadata', `track=${tags.trackNumber}`);

    await execFileAsync('ffmpeg', [
      '-y',
      '-i',
      filePath,
      '-map',
      '0',
      '-c',
      'copy',
      ...metadataArgs,
      tmpPath,
    ]);

    await rename(tmpPath, filePath);
  }
}
