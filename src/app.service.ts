import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  private readonly ACCUWEATHER_API_KEY = process.env.WEATHER_API_KEY;
  private readonly LOCATIONAPI_KEY = process.env.LOCATION_API_KEY;

  async getHello(visitorName: string, clientIp: string) {
    try {
      const locationData = await axios.get(
        `https://api.ipgeolocation.io/ipgeo?`,
        {
          params: {
            apikey: this.LOCATIONAPI_KEY,
            ip: clientIp,
          },
        },
      );
      const locationResponse = await axios.get(
        `http://dataservice.accuweather.com/locations/v1/cities/ipaddress`,
        {
          params: {
            apikey: this.ACCUWEATHER_API_KEY,
            q: clientIp,
          },
        },
      );
      if (
        locationResponse.status !== 200 ||
        !locationResponse.data.EnglishName
      ) {
        throw new HttpException(
          'Unable to fetch location data',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
      const location: string = locationData.data.city;
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
        key: locationResponse.data.Key,
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
