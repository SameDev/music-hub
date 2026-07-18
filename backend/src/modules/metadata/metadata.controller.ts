import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MetadataService } from './metadata.service';

@ApiTags('metadata')
@Controller('metadata')
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}
}
