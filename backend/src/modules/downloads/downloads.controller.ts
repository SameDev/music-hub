import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DownloadsService } from './downloads.service';

@ApiTags('downloads')
@Controller('downloads')
export class DownloadsController {
  constructor(private readonly downloadsService: DownloadsService) {}
}
