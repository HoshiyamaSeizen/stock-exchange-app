import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { TradeService } from './trade.service';

@Controller('/api/trade')
export class TradeController {
  constructor(private readonly service: TradeService) {}

  @Get()
  getBrokers(@Res() res: Response): void {
    res.json({ running: this.service.isRunning() });
  }

  @Get('history/:abbr')
  getHistory(@Res() res: Response, @Param('abbr') abbr: string): void {
    res.json({ data: this.service.getCompanyHistory(abbr) });
  }

  @Post('history/:abbr')
  getHistoryInterval(
    @Res() res: Response,
    @Body() body: any,
    @Param('abbr') abbr: string,
  ): void {
    res.json({ data: this.service.getCompanyHistoryInterval(abbr, body.date) });
  }

  @Post('/buy')
  buyStock(@Res() res: Response, @Body() body: any) {
    res.json(this.service.buy(body.id, body.stockid));
  }

  @Post('/sell')
  sellStock(@Res() res: Response, @Body() body: any) {
    res.json(this.service.sell(body.id, body.stockid));
  }
}
