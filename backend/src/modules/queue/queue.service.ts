import { Injectable } from '@nestjs/common';
import { QueueRepository } from './queue.repository';

@Injectable()
export class QueueService {
  constructor(private readonly queueRepository: QueueRepository) {}
}
