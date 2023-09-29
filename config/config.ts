export default () => ({
  httpPort: process.env.HTTP_PORT,
  database: {
    userName: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    host: 'postgresql_db',
    name: 'air_quality',
  },
  airQualityAPI: {
    baseUrl: 'https://api.airvisual.com/v2/nearest_city',
    apiKey: process.env.AIR_QUALITY_API_KEY,
  },
});
