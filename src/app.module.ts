import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketModule } from './market';
import { NotificationGateway } from './notificacion';
import { DbListenerModule } from './db-listener';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('DB_HOST');
        const port = configService.get<number>('DB_PORT');
        const username = configService.get<string>('DB_USERNAME');
        const password = configService.get<string>('DB_PASSWORD');
        const database = configService.get<string>('DB_NAME');

        // Log para verificar que las variables son correctas
        Logger.warn('DB_HOST', host);
        Logger.warn('DB_PORT', port);
        Logger.warn('DB_USERNAME', username);
        Logger.warn('DB_PASSWORD', password);
        Logger.warn('DB_NAME', database);

        return {
          type: 'postgres',
          host: host,
          port: port,
          username: username,
          password: password,
          database: database,
          synchronize: false,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
        };
      },
    }),
    MarketModule,
    DbListenerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
