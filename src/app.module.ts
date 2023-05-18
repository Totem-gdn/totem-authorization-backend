import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { WebsocketsModule } from './websocket/websocket.module';

@Module({
  imports: [EventsModule, WebsocketsModule],
})
export class AppModule {}
