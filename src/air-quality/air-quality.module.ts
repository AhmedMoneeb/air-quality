import { Module } from '@nestjs/common';
import { AirQualityController } from './controller/air-quality.controller';
import { AirQualityService } from './service/air-quality.service';
import { CronService } from './service/cron.service';
import { HttpModule } from '@nestjs/axios';
import { SequelizeModule } from '@nestjs/sequelize';
import { Pollution } from './model/db/pollution.model';
import { PollutionRepository } from './repository/pollution.repository';
@Module({
  imports: [HttpModule, SequelizeModule.forFeature([Pollution])],
  controllers: [AirQualityController],
  providers: [AirQualityService, CronService, PollutionRepository],
})
export class AirQualityModule {}
