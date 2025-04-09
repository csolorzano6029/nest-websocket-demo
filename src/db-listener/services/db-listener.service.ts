import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client, ClientConfig } from 'pg';
import { NotificationGateway } from '../../notificacion';
import { ConfigService } from '@nestjs/config';
import { MarketUpdateNotification } from 'src/market/interfaces';
import { MarketService } from 'src/market';

@Injectable()
export class DbListenerService implements OnModuleInit {
  private client!: Client;

  constructor(
    private readonly notificationGateway: NotificationGateway,
    private readonly configService: ConfigService,
    private readonly marketService: MarketService,
  ) {}

  private getConnection(): ClientConfig {
    return {
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
    };
  }

  async onModuleInit() {
    this.client = new Client(this.getConnection());

    await this.client.connect();
    await this.client.query('LISTEN table_changes');
    console.log('\n');
    Logger.log('LISTENING TO TABLE CHANGES', 'DB LISTENER');

    this.client.on('notification', (msg) => {
      (async () => {
        const data: MarketUpdateNotification = JSON.parse(String(msg.payload));
        const { id, processName, schema, table } = data;
        const market = await this.marketService.findMarketById(id);
        console.log('\n');
        Logger.log(id, 'ID');
        Logger.log(processName, 'PROCESS NAME');
        Logger.log(schema, 'SCHEMA');
        Logger.log(table, 'TABLE');
        this.notificationGateway.sendNotification({
          market,
          processName,
          schema,
          table,
        });
      })().catch((error) => {
        console.error('Error handling notification:', error);
      });
    });
  }
}
