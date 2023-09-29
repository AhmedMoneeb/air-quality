import { Test, TestingModule } from '@nestjs/testing';
import { PollutionRepository } from './pollution.repository';
import { Pollution } from '../model/db/pollution.model';
import { getModelToken } from '@nestjs/sequelize';

describe('PollutionRepository', () => {
  let repository: PollutionRepository;
  let mockPollutionModel;

  beforeEach(async () => {
    mockPollutionModel = {
      create: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollutionRepository,
        {
          provide: getModelToken(Pollution),
          useValue: mockPollutionModel,
        },
      ],
    }).compile();

    repository = module.get<PollutionRepository>(PollutionRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a pollution record successfully', async () => {
      const params = {
        country: 'Country',
        city: 'City',
        ts: '2023-09-29T00:00:00Z',
        aqius: 100,
        mainus: 'pm25',
        aqicn: 80,
        maincn: 'pm10',
      };

      await repository.create(params);

      expect(mockPollutionModel.create).toHaveBeenCalledWith({
        ...params,
        id: expect.any(String),
      });
    });

    it('should throw an error when creation fails', async () => {
      const params = {
        country: 'Country',
        city: 'City',
        ts: '2023-09-29T00:00:00Z',
        aqius: 100,
        mainus: 'pm25',
        aqicn: 80,
        maincn: 'pm10',
      };

      mockPollutionModel.create.mockImplementation(() => {
        throw new Error();
      });

      await expect(repository.create(params)).rejects.toThrowError();
    });
  });

  describe('whenWasMostPolluted', () => {
    it('should return the timestamp when the city was most polluted', async () => {
      const city = 'City';
      const timestamp = '2023-09-29T00:00:00Z';
      mockPollutionModel.findAll.mockResolvedValue([
        {
          ts: timestamp,
        },
      ]);

      const result = await repository.whenWasMostPolluted(city);

      expect(result).toEqual(timestamp);
      expect(mockPollutionModel.findAll).toHaveBeenCalledWith({
        attributes: ['ts'],
        where: {
          city: city,
        },
        order: [['aqius', 'DESC']],
        limit: 1,
      });
    });

    it('should return null if there are no records for the city', async () => {
      const city = 'City';
      mockPollutionModel.findAll.mockResolvedValue([]);

      const result = await repository.whenWasMostPolluted(city);

      expect(result).toBeNull();
    });

    it('should throw an error when query execution fails', async () => {
      const city = 'City';
      mockPollutionModel.findAll.mockImplementation(() => {
        throw new Error();
      });

      await expect(repository.whenWasMostPolluted(city)).rejects.toThrowError();
    });
  });
});
