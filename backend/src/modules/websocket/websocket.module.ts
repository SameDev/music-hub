import { Module } from '@nestjs/common';
import { WebSocketController } from './websocket.controller';
import { WebSocketService } from './websocket.service';
import { WebSocketRepository } from './websocket.repository';

@Module({
  controllers: [WebSocketController],
  providers: [WebSocketService, WebSocketRepository],
  exports: [WebSocketService],
})
export class WebSocketModule {}
