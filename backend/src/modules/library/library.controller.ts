import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { HistoryQueryDto } from './dto/history-query.dto';
import { ListAlbumsQueryDto } from './dto/list-albums-query.dto';
import { SearchTracksQueryDto } from './dto/search-tracks-query.dto';
import { LibraryService } from './library.service';

@ApiTags('library')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('library')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('tracks')
  searchTracks(@Query() query: SearchTracksQueryDto) {
    return this.libraryService.searchTracks(query);
  }

  @Get('artists')
  listArtists(@Query('search') search?: string) {
    return this.libraryService.listArtists(search);
  }

  @Get('albums')
  listAlbums(@Query() query: ListAlbumsQueryDto) {
    return this.libraryService.listAlbums(query.artistId);
  }

  @Get('genres')
  listGenres() {
    return this.libraryService.listGenres();
  }

  @Get('favorites')
  listFavorites(@CurrentUser() user: JwtPayload) {
    return this.libraryService.listFavorites(user.sub);
  }

  @Post('tracks/:id/favorite')
  @HttpCode(HttpStatus.NO_CONTENT)
  async favorite(@CurrentUser() user: JwtPayload, @Param('id') trackId: string): Promise<void> {
    await this.libraryService.favorite(user.sub, trackId);
  }

  @Delete('tracks/:id/favorite')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfavorite(@CurrentUser() user: JwtPayload, @Param('id') trackId: string): Promise<void> {
    await this.libraryService.unfavorite(user.sub, trackId);
  }

  @Post('tracks/:id/play')
  @HttpCode(HttpStatus.NO_CONTENT)
  async recordPlay(@CurrentUser() user: JwtPayload, @Param('id') trackId: string): Promise<void> {
    await this.libraryService.recordPlay(user.sub, trackId);
  }

  @Get('history')
  listHistory(@CurrentUser() user: JwtPayload, @Query() query: HistoryQueryDto) {
    return this.libraryService.listHistory(user.sub, query.limit);
  }
}
