import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

const stocksFileDefault = './data/stocks.json';

@Injectable()
export class StocksService {
  getStocksService(stocksFile = stocksFileDefault): Stock[] {
    return JSON.parse(fs.readFileSync(stocksFile).toString());
  }

  toggleStock(
    id: number,
    include: boolean,
    stocksFile = stocksFileDefault,
  ): Stock {
    const stocks: Stock[] = JSON.parse(fs.readFileSync(stocksFile).toString());
    const stock = stocks.find((stock) => stock.id === id);
    stock.checked = include;
    fs.writeFileSync(stocksFile, JSON.stringify(stocks, null, 2));
    return stock;
  }
}

export type Stock = {
  id: number;
  abbr: string;
  name: string;
  checked: boolean;
};
