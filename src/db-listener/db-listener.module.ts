import { Module } from '@nestjs/common';
import { MarketModule } from 'src/market';
import { NotificationGateway } from '../notificacion';
import { DbListenerService } from './services';

@Module({
  imports: [MarketModule],
  providers: [DbListenerService, NotificationGateway],
  exports: [DbListenerService, NotificationGateway],
})
export class DbListenerModule {}
