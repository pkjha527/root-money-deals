import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to the Deals API! Use /api/deals to access the deals endpoints.';
  }
  
  getHealth(): any {
    // Check database connection
    // TODO: Implement database health check
    const dbStatus = 'ok';
    // Return a comprehensive health check response
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: dbStatus
      },
      // Simple format for Railway to detect
      railway: true
    };
  }
}
