import { Injectable } from '@nestjs/common';
import { WebSocketRepository } from './websocket.repository';

@Injectable()
export class WebSocketService {
  constructor(private readonly websocketRepository: WebSocketRepository) {}
}
