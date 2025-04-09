import { Module } from '@nestjs/common';
import { DbListenerService } from './services';
import { NotificationGateway } from '../notificacion';

@Module({
  providers: [DbListenerService, NotificationGateway],
  exports: [DbListenerService, NotificationGateway],
})
export class DbListenerModule {}
