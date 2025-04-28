import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './application.service';
import { DealsModule } from './deals/deals.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/deals'),
    DealsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
