import { Injectable } from '@nestjs/common';
import { DownloadsRepository } from './downloads.repository';

@Injectable()
export class DownloadsService {
  constructor(private readonly downloadsRepository: DownloadsRepository) {}
}
