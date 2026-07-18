import { Module } from '@nestjs/common';
import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';
import { MetadataRepository } from './metadata.repository';

@Module({
  controllers: [MetadataController],
  providers: [MetadataService, MetadataRepository],
  exports: [MetadataService],
})
export class MetadataModule {}
