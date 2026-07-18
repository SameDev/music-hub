import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { AddTrackDto } from './dto/add-track.dto';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { ReorderTracksDto } from './dto/reorder-tracks.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { PlaylistsService } from './playlists.service';

@ApiTags('playlists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreatePlaylistDto) {
    return this.playlistsService.create(user.sub, dto);
  }

  @Get()
  list(@CurrentUser() user: JwtPayload) {
    return this.playlistsService.list(user.sub);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.playlistsService.findOne(user.sub, id);
  }

  @Patch(':id')
  update(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdatePlaylistDto) {
    return this.playlistsService.update(user.sub, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<void> {
    return this.playlistsService.remove(user.sub, id);
  }

  @Post(':id/tracks')
  @HttpCode(HttpStatus.NO_CONTENT)
  addTrack(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: AddTrackDto): Promise<void> {
    return this.playlistsService.addTrack(user.sub, id, dto.trackId);
  }

  @Delete(':id/tracks/:trackId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrack(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Param('trackId') trackId: string,
  ): Promise<void> {
    return this.playlistsService.removeTrack(user.sub, id, trackId);
  }

  @Patch(':id/reorder')
  @HttpCode(HttpStatus.NO_CONTENT)
  reorder(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: ReorderTracksDto): Promise<void> {
    return this.playlistsService.reorder(user.sub, id, dto.trackIds);
  }
}
