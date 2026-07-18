import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReadTagsDto } from './dto/read-tags.dto';
import { WriteTagsDto } from './dto/write-tags.dto';
import { AudioTags } from './interfaces/audio-tags.interface';
import { MetadataService } from './metadata.service';

@ApiTags('metadata')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Post('read')
  readTags(@Body() dto: ReadTagsDto): Promise<AudioTags> {
    return this.metadataService.readTags(dto.filePath);
  }

  @Post('write')
  @HttpCode(HttpStatus.NO_CONTENT)
  async writeTags(@Body() dto: WriteTagsDto): Promise<void> {
    await this.metadataService.writeTags(dto);
  }
}
