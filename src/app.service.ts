import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  private readonly ACCUWEATHER_API_KEY = process.env.WEATHER_API_KEY;

  async getHello(visitorName: string, clientIp: string) {
    const locationResponse = await axios.get(
      `http://dataservice.accuweather.com/locations/v1/cities/ipaddress`,
      {
        params: {
          apikey: this.ACCUWEATHER_API_KEY,
          q: clientIp,
        },
      },
    );
    if (locationResponse.status !== 200 || !locationResponse.data.EnglishName) {
      throw new Error('Unable to fetch location data');
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
      throw new Error('Unable to fetch weather data');
    }
    const temperature: number = weatherData.data[0].Temperature.Metric.Value;

    return {
      client_ip: clientIp,
      location: location,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`,
    };
  }
}
