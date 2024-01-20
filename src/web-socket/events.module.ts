import { Module } from '@nestjs/common';
import { GlobalModule } from 'src/global/global-module.module';
import { EventsGateway } from './events.gateway';

@Module({
    imports:[ GlobalModule],
    providers: [EventsGateway],
})
export class EventsModule {}