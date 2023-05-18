import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayDisconnect {
  private clients;
  constructor() {
    this.clients = {};
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('connect:room')
  onConnectRoom(client, data): any {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    client.join(data.room);
    this.clients[client.id] = data.room;
    this.server
      .to(data.room)
      .emit('events', { type: 'user:connected', id: client.id });
  }

  @SubscribeMessage('events')
  onEvent(client, data): any {
    const room = Array.from(client.rooms)[1];
    if (room) {
      this.server
        .to(room.toString())
        .emit('events', { type: 'user:data', id: client.id, ...data });
    }
  }

  handleDisconnect(client: any) {
    const room = this.clients[client.id];
    if (room) {
      this.server
        .to(room)
        .emit('events', { type: 'user:disconnected', id: client.id });
    }
  }
}
