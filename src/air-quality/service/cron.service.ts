import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AirQualityService } from './air-quality.service';
import { PollutionRepository } from '../repository/pollution.repository';

const PARIS_LAT_LNG = {
  latitude: 48.856613,
  longitude: 2.352222,
};

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(
    private readonly airQualityService: AirQualityService,
    private readonly pollutionRepository: PollutionRepository,
  ) {}
  @Cron(CronExpression.EVERY_MINUTE)
  async getAirQualityForParis() {
    try {
      const airQuality = await this.airQualityService.getAirQualityByLatLng(
        PARIS_LAT_LNG.latitude,
        PARIS_LAT_LNG.longitude,
      );
      await this.pollutionRepository.create({
        country: airQuality.country,
        city: airQuality.city,
        aqicn: airQuality.current.pollution.aqicn,
        aqius: airQuality.current.pollution.aqius,
        maincn: airQuality.current.pollution.maincn,
        mainus: airQuality.current.pollution.mainus,
        ts: airQuality.current.pollution.ts,
      });
    } catch (error) {
      this.logger.error(
        'Error while getting air quality for Paris',
        error.stack,
      );
      /* it might be good idea to send an alert or email */
    }
  }
}
