import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { LibraryModule } from './modules/library/library.module';
import { DownloadsModule } from './modules/downloads/downloads.module';
import { QueueModule } from './modules/queue/queue.module';
import { MetadataModule } from './modules/metadata/metadata.module';
import { PlaylistsModule } from './modules/playlists/playlists.module';
import { SettingsModule } from './modules/settings/settings.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { WebSocketModule } from './modules/websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    LibraryModule,
    DownloadsModule,
    QueueModule,
    MetadataModule,
    PlaylistsModule,
    SettingsModule,
    IntegrationsModule,
    WebSocketModule,
  ],
})
export class AppModule {}
