import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
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
export class EventsGateway {
  private clients = {};
  constructor() {
    this.clients = {};
  }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('connect:room')
  // events(@MessageBody() data: any): Observable<WsResponse<number>> {
  onEvent(client, data): any {
    console.log('123123', data, client);
  }
}
