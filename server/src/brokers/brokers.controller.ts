import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Req,
  Res,
  Body,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { BrokersService } from './brokers.service';

@Controller('/api/brokers')
export class BrokersController {
  constructor(private readonly service: BrokersService) {}

  @Get()
  getBrokers(@Res() res: Response): void {
    res.json(this.service.getBrokersService());
  }

  @Post()
  addBroker(@Res() res: Response, @Body() body: any): void {
    res.json(this.service.addBrokerService(body.name, body.money));
  }

  @Put('/:id')
  changeBrokerMoney(
    @Res() res: Response,
    @Body() body: any,
    @Param('id') id: number,
  ) {
    res.json(this.service.changeMoney(+id, body.money));
  }

  @Delete('/:id')
  deleteBroker(@Res() res: Response, @Param('id') id: number): void {
    this.service.deleteBrokerService(+id);
    res.end();
  }
}
