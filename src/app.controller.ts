import { Controller, Get } from '@nestjs/common';
// Import the service from the new path
import { AppService } from './application.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth(): any {
    return this.appService.getHealth();
  }
}
