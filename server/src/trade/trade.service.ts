import { Server } from 'http';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

const datesJSON = './data/dates.json';
const dataFolder = './data/history/';

@Injectable()
export class TradeService {
  private interval: NodeJS.Timer;
  private index: number;
  private running = false;

  getCompanyHistory(abbr: string) {
    return JSON.parse(fs.readFileSync(`${dataFolder}${abbr}.json`).toString());
  }

  startTrade(
    stocks: string[],
    date: string,
    pace: number,
    server: Server,
  ): boolean {
    const dates: string[] = JSON.parse(fs.readFileSync(datesJSON).toString());
    this.index = dates.indexOf(date);
    if (this.index < 0) return false;

    const data = new Map<string, number[]>();
    stocks.forEach((stock) => {
      data.set(
        stock,
        JSON.parse(fs.readFileSync(`${dataFolder}${stock}.json`).toString())
          .Open,
      );
    });

    this.running = true;
    this.interval = setInterval(() => {
      this.index = this.index + 1;
      if (this.index === dates.length) this.stopTrade();
      server.emit('data', {
        date: dates[this.index],
        stocks: stocks.map((stock) => ({
          abbr: stock,
          price: data.get(stock)[this.index],
        })),
      });
    }, 1000 * pace);

    return true;
  }

  stopTrade(): void {
    clearInterval(this.interval);
    this.running = false;
  }

  isRunning(): boolean {
    return this.running;
  }
}
