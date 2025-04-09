import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientConfig } from 'pg';
import { NotificationGateway } from '../../notificacion';
import { ConfigService } from '@nestjs/config';

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
    await this.client.query('LISTEN market_update');

    console.log('🟢 Escuchando market_update');

    this.client.on('notification', (msg) => {
      const data = JSON.parse(String(msg.payload));
      console.log('📦 Evento recibido:', data);

      this.notificationGateway.sendNotification({
        mensaje: `Market "${data.name}" actualizado`,
        hora: data.update_date,
      });
    });
  }
}
