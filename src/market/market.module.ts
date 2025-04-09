import { Module } from '@nestjs/common';
import { MarketService, MarketController, MarketEntity } from '../market';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationGateway } from '../notificacion';

@Module({
  imports: [TypeOrmModule.forFeature([MarketEntity])],
  providers: [MarketService, NotificationGateway],
  exports: [MarketService],
  controllers: [MarketController],
})
export class MarketModule {}
