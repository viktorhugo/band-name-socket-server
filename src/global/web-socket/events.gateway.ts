import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import 'dotenv/config';
import { Server } from 'ws';
    
@WebSocketGateway( 
    Number(process.env.WEBSOCKET_PORT),  
    { 
        transports: ['websocket'],
        cors: { origin: '*' },
    } 
)
export class EventsGateway {
    
    @WebSocketServer()
    server: Server;

    wsClients: Socket[] = [];

    // this execute after Init listen websocket
    afterInit() {
        console.warn(`Init WebSocket Server - Port:${process.env.WEBSOCKET_PORT}`);
    }

    // validate Connection with webSocket
    public async handleConnection(client: Socket, req: Request) {
        this.wsClients.push(client);
        console.log(`(Client connected) :: Total ==> ${this.wsClients.length}`);
    }

    // method listen when client disconnected
    public async handleDisconnect(client: any) {
        // check if public api node
        for (let i = 0; i < this.wsClients.length; i++) {
            if (this.wsClients[i] === client) {
                this.wsClients.splice(i, 1);
                break;
            }
        }
        console.log(`(Client Disconnected) :: Total ==>  ${this.wsClients.length}`);
        //send message bradcast 
        // this.broadcast('disconnect',{});
    }

    private broadcastMessage(event, message: any) {
        const broadCastMessage = JSON.stringify(message);
        for (let c of this.wsClients) {
            c.send(broadCastMessage);
        }
    }

    @SubscribeMessage('create-band')
    handleEventCreateBand( @ConnectedSocket() client: Socket, @MessageBody() data: string) {
        console.log(data);
        const res = {
            event: 'create-band', 
            data: data
        }
        client.emit('message', data);
        // return res;
    }

    @SubscribeMessage('Delete-band')
    handleEventDeleteBand( @ConnectedSocket() client: Socket, @MessageBody() data: string,): string {
        console.log(data);
        return data;
    }

    // @SubscribeMessage('create-band')
    // public handleEventAddBand( client: Socket, message: any): string {
    //     console.log(message, client);
    //     return message;
    // }
}