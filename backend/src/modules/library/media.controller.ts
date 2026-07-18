import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import type { Request, Response } from 'express';
import { JwtQueryAuthGuard } from '../auth/guards/jwt-query-auth.guard';
import { LibraryService } from './library.service';
import { getMimeType } from './lib/mime-types';

// Separate from LibraryController deliberately: <audio>/<img> tags can't send an
// Authorization header, so these two routes authenticate via JwtQueryAuthGuard (token in the
// URL) instead of the header-based JwtAuthGuard the rest of the module's routes require.
@ApiTags('library')
@UseGuards(JwtQueryAuthGuard)
@Controller('library')
export class MediaController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('tracks/:id/stream')
  async stream(@Param('id') trackId: string, @Req() req: Request, @Res() res: Response): Promise<void> {
    const filePath = await this.libraryService.getTrackFilePath(trackId);
    const stats = await stat(filePath);
    const mimeType = getMimeType(filePath);
    const range = req.headers.range;

    if (range) {
      const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr ?? '0', 10);
      const end = endStr ? parseInt(endStr, 10) : stats.size - 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Content-Type': mimeType,
      });
      createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Length': stats.size,
      'Content-Type': mimeType,
      'Accept-Ranges': 'bytes',
    });
    createReadStream(filePath).pipe(res);
  }

  @Get('covers/:filename')
  async cover(@Param('filename') filename: string, @Res() res: Response): Promise<void> {
    const filePath = await this.libraryService.getCoverFilePath(filename);
    res.setHeader('Content-Type', getMimeType(filePath));
    createReadStream(filePath).pipe(res);
  }
}
