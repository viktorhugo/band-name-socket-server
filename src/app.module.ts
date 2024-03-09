import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GlobalModule } from './global/global-module.module';
import { EventsModule } from './web-socket/events.module';

@Module({
  imports: [
    EventsModule,
    GlobalModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
  ],
})
export class AppModule {}
