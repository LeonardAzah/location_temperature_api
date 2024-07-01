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
    const ip = request.ip;
    return this.appService.getHello(visitor_name, ip);
  }
}
