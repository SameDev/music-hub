import { Module } from '@nestjs/common';
import { DownloadsController } from './downloads.controller';
import { DownloadsService } from './downloads.service';
import { DownloadsRepository } from './downloads.repository';

@Module({
  controllers: [DownloadsController],
  providers: [DownloadsService, DownloadsRepository],
  exports: [DownloadsService],
})
export class DownloadsModule {}
