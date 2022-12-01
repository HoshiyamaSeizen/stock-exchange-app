import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { TradeService } from './trade.service';

@WebSocketGateway({ cors: true })
export class TradeGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly service: TradeService) {}

  @SubscribeMessage('start')
  start(client: any, payload: any): void {
    client.emit('status', {
      started: this.service.startTrade(
        payload.stocks,
        payload.date,
        payload.pace,
        this.server,
      ),
    });
  }

  @SubscribeMessage('stop')
  stop(client: any) {
    this.service.stopTrade();
    client.emit('stopped');
  }
}
