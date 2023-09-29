import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, lastValueFrom } from 'rxjs';
import { AirQualityResponseModel } from '../model/air-quality-response.model';
import { PollutionRepository } from '../repository/pollution.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AirQualityService {
  private readonly BASE_URL: string;
  private readonly API_KEY: string;
  private readonly logger = new Logger(AirQualityService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly pollutionRepository: PollutionRepository,
    private readonly configService: ConfigService,
  ) {
    this.BASE_URL = this.configService.get('airQualityAPI.baseUrl');
    this.API_KEY = this.configService.get('airQualityAPI.apiKey');
  }
  async getAirQualityByLatLng(
    lat: number,
    lng: number,
  ): Promise<AirQualityResponseModel> {
    try {
      const { data } = await lastValueFrom(
        this.httpService
          .get(`${this.BASE_URL}?lat=${lat}&lon=${lng}&key=${this.API_KEY}`)
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(
                'An error occurred while fetching air quality data',
                error.stack,
              );
              throw new HttpException(
                'An error occurred while fetching air quality data',
                HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }),
          ),
      );
      if (data && data.data) {
        return data.data as AirQualityResponseModel;
      } else {
        throw new Error('Invalid data received from air quality service');
      }
    } catch (error) {
      // Handle any other errors that might have occurred outside of catchError
      this.logger.error(
        'An error occurred while fetching air quality data',
        error.stack,
      );
      throw new HttpException(
        'An error occurred while fetching air quality data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // async getAirQualityByLatLng(
  //   lat: number,
  //   lng: number,
  // ): Promise<AirQualityResponseModel> {
  //   const { data } = await lastValueFrom(
  //     this.httpService
  //       .get(`${this.BASE_URL}?lat=${lat}&lon=${lng}&key=${this.API_KEY}`)
  //       .pipe(
  //         catchError((error: AxiosError) => {
  //           this.logger.error(
  //             'An error occurred while fetching air quality data',
  //             error.stack,
  //           );
  //           throw new HttpException(
  //             'An error occurred while fetching air quality data',
  //             HttpStatus.INTERNAL_SERVER_ERROR,
  //           );
  //         }),
  //       ),
  //   );
  //   return data.data as AirQualityResponseModel;
  // }

  async whenWasMostPolluted(city: string): Promise<string> {
    const result = await this.pollutionRepository.whenWasMostPolluted(city);
    if (!result) throw new NotFoundException();
    return result;
  }
}
