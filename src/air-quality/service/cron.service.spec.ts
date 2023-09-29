import { Test, TestingModule } from '@nestjs/testing';
import { CronService } from './cron.service';
import { AirQualityService } from './air-quality.service';
import { PollutionRepository } from '../repository/pollution.repository';
import { AirQualityResponseModel } from '../model/air-quality-response.model';
import { Logger } from '@nestjs/common';

describe('CronService', () => {
  let cronService: CronService;
  let airQualityService: AirQualityService;
  let pollutionRepository: PollutionRepository;

  let logger: Logger;

  beforeEach(async () => {
    logger = new Logger();
    jest.spyOn(logger, 'error').mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronService,
        {
          provide: AirQualityService,
          useValue: { getAirQualityByLatLng: jest.fn() },
        },
        { provide: PollutionRepository, useValue: { create: jest.fn() } },
        { provide: Logger, useValue: logger },
      ],
    }).compile();

    cronService = module.get<CronService>(CronService);
    airQualityService = module.get<AirQualityService>(AirQualityService);
    pollutionRepository = module.get<PollutionRepository>(PollutionRepository);
  });

  it('should be defined', () => {
    expect(cronService).toBeDefined();
  });

  describe('#getAirQualityForParis', () => {
    it('should call getAirQualityByLatLng and create methods with correct arguments', async () => {
      const airQuality: AirQualityResponseModel = {
        city: 'Paris',
        state: 'Île-de-France',
        country: 'France',
        location: {
          type: 'Point',
          coordinates: [2.352222, 48.856613],
        },
        current: {
          pollution: {
            ts: '2023-09-29T10:00:00.000Z',
            aqius: 70,
            mainus: 'pm10',
            aqicn: 50,
            maincn: 'pm25',
          },
          weather: {
            ts: '2023-09-29T10:00:00.000Z',
            tp: 20,
            pr: 1013,
            hu: 76,
            ws: 3.1,
            wd: 240,
            ic: 25,
          },
        },
      };
      jest
        .spyOn(airQualityService, 'getAirQualityByLatLng')
        .mockResolvedValue(airQuality);
      await cronService.getAirQualityForParis();
      expect(airQualityService.getAirQualityByLatLng).toHaveBeenCalledWith(
        48.856613,
        2.352222,
      );
      expect(pollutionRepository.create).toHaveBeenCalledWith({
        country: airQuality.country,
        city: airQuality.city,
        aqicn: airQuality.current.pollution.aqicn,
        aqius: airQuality.current.pollution.aqius,
        maincn: airQuality.current.pollution.maincn,
        mainus: airQuality.current.pollution.mainus,
        ts: airQuality.current.pollution.ts,
      });
    });

    it('should not crash if getAirQualityByLatLng throws an error', async () => {
      const error = new Error('Error!');
      jest
        .spyOn(airQualityService, 'getAirQualityByLatLng')
        .mockRejectedValue(error);

      await expect(cronService.getAirQualityForParis()).resolves.not.toThrow();
    });

    it('should not crash if pollutionRepository.create throws an error', async () => {
      const error = new Error('Error!');
      jest
        .spyOn(airQualityService, 'getAirQualityByLatLng')
        .mockResolvedValue({} as AirQualityResponseModel);
      jest.spyOn(pollutionRepository, 'create').mockRejectedValue(error);
      await expect(cronService.getAirQualityForParis()).resolves.not.toThrow();
    });

    it('should handle unexpected airQualityService response', async () => {
      jest
        .spyOn(airQualityService, 'getAirQualityByLatLng')
        .mockResolvedValue(null);
      await expect(
        cronService.getAirQualityForParis(),
      ).resolves.toBeUndefined();
      expect(pollutionRepository.create).not.toHaveBeenCalled();
    });
  });
});
