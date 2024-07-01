import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  private readonly WEATHER_API_KEY = process.env.WEATHER_API_KEY;
  private readonly LOCATION_API_KEY = process.env.LOCATION_API_KEY;

  async getHello(visitorName: string, clientIp: string) {
    try {
      const locationResponse = await axios.get(
        `https://api.ipgeolocation.io/ipgeo?`,
        {
          params: {
            apiKey: this.LOCATION_API_KEY,
            ip: clientIp,
          },
        },
      );

      if (locationResponse.status !== 200 || !locationResponse.data.city) {
        throw new HttpException(
          'Unable to fetch location data',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      const location: string = locationResponse.data.city;
      const lat = locationResponse.data.latitude;
      const lon = locationResponse.data.longitude;

      const weatherData = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat,
            lon,
            apikey: this.WEATHER_API_KEY,
            units: 'metric',
          },
        },
      );
      if (weatherData.status !== 200) {
        throw new HttpException(
          'Unable to fetch weather data',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      const temperature: number = weatherData.data.main.temp;

      return {
        client_ip: clientIp,
        location: location,
        greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`,
      };
    } catch (error) {
      console.error(
        'Error:',
        error.response ? error.response.data : error.message,
      );
      throw new HttpException(
        'Error fetching data',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
