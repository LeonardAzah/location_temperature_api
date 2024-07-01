import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  private readonly ACCUWEATHER_API_KEY = process.env.WEATHER_API_KEY;

  async getHello(visitorName: string, clientIp: string) {
    try {
      const locationResponse = await axios.get(
        `http://dataservice.accuweather.com/locations/v1/cities/ipaddress`,
        {
          params: {
            apikey: this.ACCUWEATHER_API_KEY,
            q: clientIp,
          },
        },
      );
      console.log(locationResponse);
      if (
        locationResponse.status !== 200 ||
        !locationResponse.data.EnglishName
      ) {
        throw new HttpException(
          'Unable to fetch location data',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      const location: string = locationResponse.data.EnglishName;
      const locationKey: string = locationResponse.data.Key;

      const weatherData = await axios.get(
        `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}`,
        {
          params: {
            apikey: this.ACCUWEATHER_API_KEY,
          },
        },
      );
      if (weatherData.status !== 200) {
        throw new HttpException(
          'Unable to fetch weather data',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      const temperature: number = weatherData.data[0].Temperature.Metric.Value;

      return {
        client_ip: clientIp,
        location: location,
        lat: locationResponse.data.GeoPosition.Latitude,
        lon: locationResponse.data.GeoPosition.Longitude,
        location_key: locationKey,
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
