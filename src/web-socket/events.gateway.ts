import { Logger } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import 'dotenv/config';
import { BandService } from 'src/global/services/band.service';
import { Band } from 'src/model/band';
import { EventTypes, responseMessage } from 'src/types/global-types';
import { Server } from 'ws';
    
@WebSocketGateway( 
    Number(process.env.WEBSOCKET_PORT),  
    { 
        transports: ['websocket'],
        cors: { origin: '*' },
    } 
)
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    private logger: Logger = new Logger(EventsGateway.name);
    public wsClients: Socket[] = [];

    constructor(private bandService: BandService ) {}
    
    @WebSocketServer()
    server: Server;

    // this execute after Init listen websocket
    afterInit() {
        this.logger.warn(`Init WebSocket Server - Port :${process.env.WEBSOCKET_PORT}`);
    }

    // validate Connection with webSocket
    public async handleConnection(client: Socket, req: Request) {
        this.wsClients.push(client);
        this.logger.log(`(Client connected) :: Total ==> ${this.wsClients.length}`);
        const response = {
            event: 'get-all-bands',
            data: this.bandService.getBands(),
        };
        client.send(JSON.stringify(response));
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
        this.logger.log(`(Client Disconnected) :: Total ==>  ${this.wsClients.length}`);
        //send message bradcast 
        // this.broadcast('disconnect',{});
    }

    private broadcastMessage(message: any) {
        this.logger.log('Total wsClients for broadcast message: ' + this.wsClients.length);
        const broadCastMessage = JSON.stringify(message);
        for (let c of this.wsClients) {
            c.send(broadCastMessage);
        }
    }

    // ========================= LISTEN EVENTS =============================================

    @SubscribeMessage('get-all-bands')
    handleEventGetAllBands( @ConnectedSocket() client: Socket, @MessageBody() data: string,): void {
        const response: responseMessage = {
            event: 'get-all-bands',
            data: this.bandService.getBands() as Band[] ,
        };
        client.send(JSON.stringify(response));
    }

    @SubscribeMessage(EventTypes.uniqueBand)
    handleEventGetUniqueBand( @ConnectedSocket() client: Socket, @MessageBody() data: string,): Band {
        return this.bandService.getUniqueBand(data);
    }

    @SubscribeMessage(EventTypes.createBand)
    handleEventCreateBand( @ConnectedSocket() client: Socket, @MessageBody() data: { name: string }): void  {
        this.logger.log(data);
        const { name } = data;
        this.bandService.addBand(name);
        const response: responseMessage = {
            event: 'get-all-bands',
            data: this.bandService.getBands() as Band[] ,
        };
        this.broadcastMessage(response);
        // return res;
    }

    @SubscribeMessage(EventTypes.deleteBand)
    handleEventDeleteBand( @ConnectedSocket() client: Socket, @MessageBody() data: { id: string } ): void {
        const { id } = data;
        this.bandService.deleteBand(id);
        const response: responseMessage = {
            event: 'get-all-bands',
            data: this.bandService.getBands() as Band[],
        };
        this.broadcastMessage(response);
    }

    @SubscribeMessage(EventTypes.addVoteBand)
    handleEventAddVoteBand( @ConnectedSocket() client: Socket, @MessageBody() data: { id: string } ) : void  {
        // this.logger.log(data);
        const { id } = data;
        this.bandService.voteBand(id); 
        const response: responseMessage = {
            event: 'get-all-bands',
            data: this.bandService.getBands() as Band[] ,
        };
        this.broadcastMessage(response);
    }

}