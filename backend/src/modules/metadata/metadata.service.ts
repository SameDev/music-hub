import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { access } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';
import { MetadataRepository } from './metadata.repository';
import { WriteTagsDto } from './dto/write-tags.dto';
import { AudioTags } from './interfaces/audio-tags.interface';

@Injectable()
export class MetadataService {
  constructor(
    private readonly metadataRepository: MetadataRepository,
    private readonly config: ConfigService,
  ) {}

  async readTags(filePath: string): Promise<AudioTags> {
    const safePath = await this.assertWithinLibrary(filePath);
    const parsed = await this.metadataRepository.parseFile(safePath);
    const { common, format } = parsed;

    const tags: AudioTags = {
      title: common.title,
      artist: common.artist,
      album: common.album,
      year: common.year,
      genre: common.genre?.[0],
      trackNumber: common.track?.no ?? undefined,
      durationSeconds: format.duration ? Math.round(format.duration) : undefined,
    };

    const [cover] = common.picture ?? [];
    if (cover) {
      const coversDir = join(this.config.getOrThrow<string>('LIBRARY_PATH'), '.covers');
      tags.coverPath = await this.metadataRepository.saveCoverArt(coversDir, cover.data, cover.format);
    }

    return tags;
  }

  async writeTags(dto: WriteTagsDto): Promise<void> {
    const safePath = await this.assertWithinLibrary(dto.filePath);
    const { filePath: _filePath, ...tags } = dto;
    await this.metadataRepository.writeTagsWithFfmpeg(safePath, tags);
  }

  private async assertWithinLibrary(filePath: string): Promise<string> {
    const libraryRoot = resolve(this.config.getOrThrow<string>('LIBRARY_PATH'));
    const resolvedPath = resolve(filePath);

    if (resolvedPath !== libraryRoot && !resolvedPath.startsWith(libraryRoot + sep)) {
      throw new BadRequestException('filePath must be inside the configured library directory');
    }

    try {
      await access(resolvedPath);
    } catch {
      throw new NotFoundException('File not found');
    }

    return resolvedPath;
  }
}
