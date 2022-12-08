import { Server } from 'http';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

import { Stock } from 'src/stocks/stocks.service';

const datesJSON = './data/dates.json';
const dataFolder = './data/history/';
const stocksFile = './data/stocks.json';
const brokersFile = './data/brokers.json';
const tradesFile = './data/trades.json';

@Injectable()
export class TradeService {
  private interval: NodeJS.Timer;
  private index: number;
  private startIndex: number;
  private running = false;
  private data = new Map<string, number[]>();

  getCompanyHistory(abbr: string) {
    return JSON.parse(fs.readFileSync(`${dataFolder}${abbr}.json`).toString());
  }

  getCompanyHistoryInterval(abbr: string, endDate: string) {
    const dates: string[] = JSON.parse(fs.readFileSync(datesJSON).toString());
    const fullHistory = this.getCompanyHistory(abbr).Open;
    const endIndex = dates.indexOf(endDate);
    return {
      dates: dates.slice(this.startIndex, endIndex),
      prices: fullHistory.slice(this.startIndex, endIndex),
    };
  }

  startTrade(
    stocks: string[],
    date: string,
    pace: number,
    server: Server,
  ): boolean {
    const dates: string[] = JSON.parse(fs.readFileSync(datesJSON).toString());
    this.index = dates.indexOf(date);
    this.startIndex = this.index;
    if (this.index < 0) return false;

    stocks.forEach((stock) => {
      this.data.set(
        stock,
        JSON.parse(fs.readFileSync(`${dataFolder}${stock}.json`).toString())
          .Open,
      );
    });

    const stocksFull: Stock[] = JSON.parse(
      fs.readFileSync(stocksFile).toString(),
    ).filter((stock: Stock) => stocks.includes(stock.abbr));

    this.running = true;
    this.interval = setInterval(() => {
      const brokers = JSON.parse(fs.readFileSync(brokersFile).toString());
      const trades = JSON.parse(fs.readFileSync(tradesFile).toString());

      // trades.forEach((t) => {
      //   const broker = brokers.find((b) => b.id === t.uid);
      //   if (!broker.stocks) broker.stocks = [];
      //   broker.stocks.push(t);
      // });

      this.index = this.index + 1;
      if (this.index === dates.length) this.stopTrade();
      server.emit('data', {
        date: dates[this.index],
        stocks:
          stocksFull?.map((stock) => ({
            ...stock,
            price: this.data.get(stock.abbr)[this.index],
          })) || [],
        brokers,
        trades,
      });
    }, 1000 * pace);

    return true;
  }

  stopTrade(): void {
    clearInterval(this.interval);
    this.running = false;
    this.data.clear();
  }

  isRunning(): boolean {
    return this.running;
  }

  buy(id: number, stockid: number) {
    if (!this.running) return null;
    let amount = 0;
    const stock = JSON.parse(fs.readFileSync(stocksFile).toString()).find(
      (s) => +s.id === +stockid,
    );

    const brokers = JSON.parse(fs.readFileSync(brokersFile).toString());
    const broker = brokers.find((b) => +b.id === +id);

    const trades = JSON.parse(fs.readFileSync(tradesFile).toString());
    const trade = trades.find((t) => t.uid === id && t.sid === stockid);

    const price = this.data.get(stock.abbr)[this.index];

    if (!trade) {
      if (price > broker.money) return { amount: 0, money: broker.money };
      trades.push({ uid: id, sid: stockid, amount: 1, spent: price });
      amount = 1;
    } else {
      if (price > broker.money)
        return { amount: trade.amount, money: broker.money };
      trade.amount += 1;
      trade.spent += price;
      amount = trade.amount;
    }
    broker.money -= price;

    fs.writeFileSync(brokersFile, JSON.stringify(brokers, null, 2));
    fs.writeFileSync(tradesFile, JSON.stringify(trades, null, 2));

    return { amount, money: broker.money };
  }

  sell(id: number, stockid: number) {
    if (!this.running) return null;
    let amount = 0;
    const stock = JSON.parse(fs.readFileSync(stocksFile).toString()).find(
      (s) => +s.id === +stockid,
    );

    const brokers = JSON.parse(fs.readFileSync(brokersFile).toString());
    const broker = brokers.find((b) => +b.id === +id);

    const trades = JSON.parse(fs.readFileSync(tradesFile).toString());
    const trade = trades.find((t) => t.uid === id && t.sid === stockid);

    const price = this.data.get(stock.abbr)[this.index];

    if (!trade || trade.amount === 0) {
      return { amount: 0, money: broker.money };
    } else {
      trade.amount -= 1;
      trade.spent = Math.max(0, trade.spent - price);
      amount = trade.amount;
    }
    broker.money += price;

    fs.writeFileSync(brokersFile, JSON.stringify(brokers, null, 2));
    fs.writeFileSync(tradesFile, JSON.stringify(trades, null, 2));

    return { amount, money: broker.money };
  }
}
