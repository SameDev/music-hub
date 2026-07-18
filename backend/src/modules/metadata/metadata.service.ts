import { Injectable } from '@nestjs/common';
import { MetadataRepository } from './metadata.repository';

@Injectable()
export class MetadataService {
  constructor(private readonly metadataRepository: MetadataRepository) {}
}
