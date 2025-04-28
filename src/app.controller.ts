import { Controller, Get, HttpCode } from '@nestjs/common';
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
  @HttpCode(200)
  getHealth(): any {
    return this.appService.getHealth();
  }
  
  // Alternative health check endpoint for Railway
  @Get('healthz')
  @HttpCode(200)
  getHealthz(): any {
    return this.appService.getHealth();
  }
}
