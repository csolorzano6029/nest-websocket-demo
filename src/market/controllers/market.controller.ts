import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { MarketEntity } from '../entities';
import { MarketService } from '../services';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() data: Partial<MarketEntity>) {
    return this.marketService.updateMarket(+id, data);
  }

  @Get()
  getAll() {
    return this.marketService.findAll();
  }
}
