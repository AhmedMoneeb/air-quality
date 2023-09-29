import { IsLatitude, IsLongitude } from 'class-validator';

export class GetAirQualityByLatLngDto {
  @IsLatitude()
  lat: string;

  @IsLongitude()
  lng: string;
}
