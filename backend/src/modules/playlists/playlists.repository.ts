import { Injectable } from '@nestjs/common';
import { Playlist, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const playlistWithTracks = Prisma.validator<Prisma.PlaylistDefaultArgs>()({
  include: {
    tracks: {
      orderBy: { position: 'asc' },
      include: { track: { include: { album: { include: { artist: true } } } } },
    },
  },
});
export type PlaylistWithTracks = Prisma.PlaylistGetPayload<typeof playlistWithTracks>;

@Injectable()
export class PlaylistsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, name: string, description?: string): Promise<Playlist> {
    return this.prisma.playlist.create({ data: { userId, name, description } });
  }

  findByUser(userId: string): Promise<Playlist[]> {
    return this.prisma.playlist.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  findById(id: string): Promise<PlaylistWithTracks | null> {
    return this.prisma.playlist.findUnique({ where: { id }, include: playlistWithTracks.include });
  }

  update(id: string, data: { name?: string; description?: string }): Promise<Playlist> {
    return this.prisma.playlist.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.playlist.delete({ where: { id } });
  }

  async addTrack(playlistId: string, trackId: string): Promise<void> {
    const count = await this.prisma.playlistTrack.count({ where: { playlistId } });
    await this.prisma.playlistTrack.upsert({
      where: { playlistId_trackId: { playlistId, trackId } },
      create: { playlistId, trackId, position: count },
      update: {},
    });
  }

  async removeTrack(playlistId: string, trackId: string): Promise<void> {
    await this.prisma.playlistTrack.deleteMany({ where: { playlistId, trackId } });
  }

  async reorder(playlistId: string, trackIds: string[]): Promise<void> {
    await this.prisma.$transaction(
      trackIds.map((trackId, position) =>
        this.prisma.playlistTrack.update({
          where: { playlistId_trackId: { playlistId, trackId } },
          data: { position },
        }),
      ),
    );
  }
}
