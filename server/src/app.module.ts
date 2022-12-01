import { Module } from '@nestjs/common';
import { BrokersController } from './brokers/brokers.controller';
import { BrokersService } from './brokers/brokers.service';
import { StocksController } from './stocks/stocks.controller';
import { StocksService } from './stocks/stocks.service';
import { TradeGateway } from './trade/trade.gateway';
import { TradeService } from './trade/trade.service';
import { TradeController } from './trade/trade.controller';

@Module({
  imports: [],
  controllers: [BrokersController, StocksController, TradeController],
  providers: [BrokersService, StocksService, TradeGateway, TradeService],
})
export class AppModule {}
