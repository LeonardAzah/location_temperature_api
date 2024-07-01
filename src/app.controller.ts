import { Controller, Get, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { VisitorNameDto } from './dto/visitor_name.dto';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  async getHello(
    @Query() { visitor_name }: VisitorNameDto,
    @Req() request: Request,
  ) {
    const ip = this.getClientIp(request);
    return this.appService.getHello(visitor_name, ip);
  }

  private getClientIp(request: Request): string {
    const xForwardedFor = request.headers['x-forwarded-for'];
    if (xForwardedFor) {
      const ipArray = (xForwardedFor as string).split(',');
      return ipArray[0].trim();
    }
    return (
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      '127.0.0.1'
    );
  }
}
