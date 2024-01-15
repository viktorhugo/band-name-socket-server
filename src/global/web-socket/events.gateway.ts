import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import 'dotenv/config';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'ws';
    
@WebSocketGateway( Number(process.env.WEBSOCKET_PORT),  { transports: ['websocket'] } )
export class EventsGateway {
    
    @WebSocketServer()
    server: Server;

    // this execute after Init listen websocket
    afterInit() {
        console.warn(`Init WebSocket Server - Port:${process.env.WEBSOCKET_PORT}`);
    }

    // validate Connection with webSocket
    public async handleConnection(client: any, req: Request) {
        
    }

    // method listen when client disconnected
    public async handleDisconnect(client: any) {
        // check if public api node
    }

    @SubscribeMessage('events')
    onEvent(client: any, data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
    }

    @SubscribeMessage('events')
        handleEvent( @MessageBody() data: string, @ConnectedSocket() client: Socket): string {
        return data;
    }
}