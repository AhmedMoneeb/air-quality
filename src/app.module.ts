import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AirQualityModule } from './air-quality/air-quality.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Pollution } from './air-quality/model/db/pollution.model';
import configuration from '../config/config';
@Module({
  imports: [
    AirQualityModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.userName'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        models: [Pollution],
      }),
    }),
  ],
})
export class AppModule {}
