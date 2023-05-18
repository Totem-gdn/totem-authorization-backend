import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'ws';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway(8080)
export class WebsocketsGateway {
  @WebSocketServer()
  server: Server;
  private rooms;
  constructor() {
    this.rooms = {};
  }

  @SubscribeMessage('connect:room')
  onConnectRoom(client, data): any {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    const id = uuidv4();
    client.id = id;
    client.room = data.room;
    if (!this.rooms[data.room]) {
      this.rooms[data.room] = [];
    }
    this.rooms[data.room].push(client);
    this.rooms[data.room].forEach((client) => {
      client.send(JSON.stringify({ type: 'user:connected', id: client.id }));
    });
  }

  @SubscribeMessage('events')
  onEvent(client, data): any {
    const room = this.rooms[client.room];

    if (room) {
      room.forEach((client) => {
        client.send(JSON.stringify(data));
      });
    }
  }

  handleDisconnect(client: any) {
    const room = this.rooms[client.room];

    if (room) {
      room.forEach((client) => {
        client.send(
          JSON.stringify({ type: 'user:disconnected', id: client.id }),
        );
      });
    }
  }
}
