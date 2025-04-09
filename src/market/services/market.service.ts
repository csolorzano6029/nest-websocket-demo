import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MarketEntity } from '../entities';
import { NotificationGateway } from '../../notificacion';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(MarketEntity)
    private marketRepository: Repository<MarketEntity>,
    private notificationGateway: NotificationGateway,
  ) {}

  async updateMarket(id: number, data: Partial<MarketEntity>) {
    await this.marketRepository.update(id, data);
    const update = await this.marketRepository.findOne({ where: { id } });

    // Emitimos el evento por socket
    this.notificationGateway.sendNotification({
      mensaje: `Market ${update?.name} updated`,
      time: update?.updateDate,
    });

    return update;
  }

  findAll() {
    return this.marketRepository.find();
  }

  async findMarketById(id: string): Promise<MarketEntity> {
    const market = await this.marketRepository
      .createQueryBuilder('market')
      .where('market.id = :id', { id })
      .getOne();

    if (!market) {
      throw new Error(`Market with id ${id} not found`);
    }

    return market;
  }
}
