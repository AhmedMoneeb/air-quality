export class AirQualityResponseModel {
  city: string;
  state: string;
  country: string;
  location: {
    type: string;
    coordinates: number[];
  };
  current: {
    pollution: {
      ts: string;
      aqius: number;
      mainus: string;
      aqicn: number;
      maincn: string;
    };
    weather: {
      ts: string;
      tp: number;
      pr: number;
      hu: number;
      ws: number;
      wd: number;
      ic: number;
    };
  };
}
