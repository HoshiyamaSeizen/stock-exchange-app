import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { TradeService } from './trade.service';

@Controller('/api/trade')
export class TradeController {
  constructor(private readonly service: TradeService) {}

  @Get()
  getBrokers(@Res() res: Response): void {
    res.json({ running: this.service.isRunning() });
  }

  @Get('/:abbr')
  getHistory(@Res() res: Response, @Param('abbr') abbr: string): void {
    res.json({ data: this.service.getCompanyHistory(abbr) });
  }
}
