import { Module } from '@nestjs/common';
import { BrokersController } from './brokers/brokers.controller';
import { BrokersService } from './brokers/brokers.service';
import { StocksController } from './stocks/stocks.controller';
import { StocksService } from './stocks/stocks.service';

@Module({
  imports: [],
  controllers: [BrokersController, StocksController],
  providers: [BrokersService, StocksService],
})
export class AppModule {}
