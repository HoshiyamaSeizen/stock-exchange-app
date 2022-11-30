import { Body, Controller, Get, Param, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { StocksService } from './stocks.service';

@Controller('/api/stocks')
export class StocksController {
  constructor(private readonly service: StocksService) {}

  @Get()
  getBrokers(@Res() res: Response): void {
    res.json(this.service.getStocksService());
  }

  @Put('/:id')
  changeBrokerMoney(
    @Res() res: Response,
    @Body() body: any,
    @Param('id') id: number,
  ) {
    res.json(this.service.toggleStock(+id, body.checked));
  }
}
