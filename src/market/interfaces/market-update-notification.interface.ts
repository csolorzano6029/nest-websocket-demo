import { MarketValue } from './market-value.interface';

export interface MarketUpdateNotification {
  table: string;
  schema: string;
  id: string;
  uuid: string;
  processName: string;
  newValues: MarketValue;
  oldValues: MarketValue;
}
