import { Controller, Get, Query } from '@nestjs/common';
import { AirQualityService } from '../service/air-quality.service';
import { GetAirQualityByLatLngDto } from '../dto/get-air-quality.dto';
import { GetAirQualityByLatLngResponseDto } from '../dto/get-air-quality-response.dto';
import { ApiResponse } from '@nestjs/swagger';
@Controller()
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @ApiResponse({
    status: 200,
    description: 'Fetch air quality data for given lat & lng ',
    type: GetAirQualityByLatLngResponseDto,
  })
  @Get('air-quality')
  async getAirQualityByLatLng(@Query() query: GetAirQualityByLatLngDto) {
    const result = await this.airQualityService.getAirQualityByLatLng(
      parseFloat(query.lat),
      parseFloat(query.lng),
    );
    return {
      result: {
        pollution: result.current.pollution,
      },
    };
  }
  @Get('paris-most-polluted-time')
  async whenParisWasMostPolluted() {
    return await this.airQualityService.whenWasMostPolluted('Paris');
  }
}
