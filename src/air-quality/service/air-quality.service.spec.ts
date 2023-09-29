import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { AirQualityService } from '../service/air-quality.service';
import { PollutionRepository } from '../repository/pollution.repository';
import { ConfigService } from '@nestjs/config';

describe('AirQualityService', () => {
  let service: AirQualityService;
  let httpService: HttpService;
  let pollutionRepository: PollutionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirQualityService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: PollutionRepository,
          useValue: {
            whenWasMostPolluted: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test'),
          },
        },
      ],
    }).compile();

    service = module.get<AirQualityService>(AirQualityService);
    httpService = module.get<HttpService>(HttpService);
    pollutionRepository = module.get<PollutionRepository>(PollutionRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAirQualityByLatLng', () => {
    it('should return air quality data', async () => {
      const result = {
        data: { data: 'air quality data' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };
      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(result));

      expect(await service.getAirQualityByLatLng(1, 1)).toBe(result.data.data);
    });

    it('should throw HttpException when fails to fetch air quality data', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() =>
          throwError(() => new Error('Fetch error')),
        );

      await expect(service.getAirQualityByLatLng(1, 1)).rejects.toThrow(
        HttpException,
      );
      await expect(service.getAirQualityByLatLng(1, 1)).rejects.toEqual(
        new HttpException(
          'An error occurred while fetching air quality data',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('whenWasMostPolluted', () => {
    it('should return most polluted time', async () => {
      const result = '2019-01-01T00:00:00.000Z';
      jest
        .spyOn(pollutionRepository, 'whenWasMostPolluted')
        .mockResolvedValueOnce(result);

      expect(await service.whenWasMostPolluted('city')).toBe(result);
    });

    it('should throw NotFoundException when no data is found', async () => {
      jest
        .spyOn(pollutionRepository, 'whenWasMostPolluted')
        .mockResolvedValueOnce(null);

      await expect(service.whenWasMostPolluted('city')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
