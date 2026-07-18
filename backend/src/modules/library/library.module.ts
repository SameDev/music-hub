import { Module } from '@nestjs/common';
import { SettingsModule } from '../settings/settings.module';
import { LibraryController } from './library.controller';
import { MediaController } from './media.controller';
import { LibraryService } from './library.service';
import { LibraryRepository } from './library.repository';

@Module({
  imports: [SettingsModule],
  controllers: [LibraryController, MediaController],
  providers: [LibraryService, LibraryRepository],
  exports: [LibraryService],
})
export class LibraryModule {}
