import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientConfig } from 'pg';
import { NotificationGateway } from '../../notificacion';
import { ConfigService } from '@nestjs/config';
import { MarketUpdateNotification } from 'src/market/interfaces';

@Injectable()
export class DbListenerService implements OnModuleInit {
  private client!: Client;

  constructor(
    private readonly notificationGateway: NotificationGateway,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const clientConfig: ClientConfig = {
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
    };

    this.client = new Client(clientConfig);

    await this.client.connect();
    await this.client.query('LISTEN table_changes');

    console.log('🟢 Escuchando table_changes');

    this.client.on('notification', (msg) => {
      const data: MarketUpdateNotification = JSON.parse(String(msg.payload));
      console.log('📦 Evento recibido:', data);

      this.notificationGateway.sendNotification({
        data,
      });
    });
  }
}
