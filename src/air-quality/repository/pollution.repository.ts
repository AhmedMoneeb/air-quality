import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Pollution } from '../model/db/pollution.model';
import { uuid } from 'uuidv4';
@Injectable()
export class PollutionRepository {
  private readonly logger = new Logger(PollutionRepository.name);
  constructor(
    @InjectModel(Pollution)
    private readonly pollutionModel: typeof Pollution,
  ) {}
  async create(params: {
    country: string;
    city: string;
    ts: string;
    aqius: number;
    mainus: string;
    aqicn: number;
    maincn: string;
  }) {
    try {
      await this.pollutionModel.create({
        id: uuid(),
        country: params.country,
        city: params.city,
        ts: params.ts,
        aqius: params.aqius,
        mainus: params.mainus,
        aqicn: params.aqicn,
        maincn: params.maincn,
      });
    } catch (error) {
      this.logger.error(
        'Error happened while creating a record in the pollution table',
        error.stack,
      );
      throw new Error();
    }
  }

  async whenWasMostPolluted(city: string): Promise<string> {
    try {
      const result = await this.pollutionModel.findAll({
        attributes: ['ts'],
        where: {
          city: city,
        },
        order: [['aqius', 'DESC']],
        limit: 1,
      });
      if (result.length > 0) {
        return result[0].ts;
      }
      return null;
    } catch (error) {
      this.logger.error(
        'Error happened while executing the query the pollution table in "whenWasMostPolluted" function',
        error.stack,
      );
      throw new Error();
    }
  }
}
