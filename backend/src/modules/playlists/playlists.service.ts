import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Playlist, Prisma } from '@prisma/client';
import { PlaylistsRepository, PlaylistWithTracks } from './playlists.repository';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(private readonly playlistsRepository: PlaylistsRepository) {}

  create(userId: string, dto: CreatePlaylistDto): Promise<Playlist> {
    return this.playlistsRepository.create(userId, dto.name, dto.description);
  }

  list(userId: string): Promise<Playlist[]> {
    return this.playlistsRepository.findByUser(userId);
  }

  async findOne(userId: string, id: string): Promise<PlaylistWithTracks> {
    const playlist = await this.playlistsRepository.findById(id);
    if (!playlist) {
      throw new NotFoundException('Playlist not found');
    }
    if (playlist.userId !== userId) {
      throw new ForbiddenException();
    }
    return playlist;
  }

  async update(userId: string, id: string, dto: UpdatePlaylistDto): Promise<Playlist> {
    await this.findOne(userId, id);
    return this.playlistsRepository.update(id, dto);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.findOne(userId, id);
    await this.playlistsRepository.delete(id);
  }

  async addTrack(userId: string, playlistId: string, trackId: string): Promise<void> {
    await this.findOne(userId, playlistId);
    try {
      await this.playlistsRepository.addTrack(playlistId, trackId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new NotFoundException('Track not found');
      }
      throw error;
    }
  }

  async removeTrack(userId: string, playlistId: string, trackId: string): Promise<void> {
    await this.findOne(userId, playlistId);
    await this.playlistsRepository.removeTrack(playlistId, trackId);
  }

  async reorder(userId: string, playlistId: string, trackIds: string[]): Promise<void> {
    const playlist = await this.findOne(userId, playlistId);
    const currentIds = new Set(playlist.tracks.map((t) => t.trackId));
    const requestedIds = new Set(trackIds);

    if (currentIds.size !== requestedIds.size || [...currentIds].some((id) => !requestedIds.has(id))) {
      throw new BadRequestException('trackIds must match the playlist\'s current tracks exactly');
    }

    await this.playlistsRepository.reorder(playlistId, trackIds);
  }
}
