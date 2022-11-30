import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

const brokersFileDefault = './data/brokers.json';

@Injectable()
export class BrokersService {
  getBrokersService(brokersFile = brokersFileDefault): Broker[] {
    return JSON.parse(fs.readFileSync(brokersFile).toString());
  }

  addBrokerService(
    name: string,
    money: number,
    brokersFile = brokersFileDefault,
  ): Broker {
    const brokers: Broker[] = JSON.parse(
      fs.readFileSync(brokersFile).toString(),
    );
    const newBroker = {
      id: brokers.at(-1).id + 1 || 0,
      name,
      money,
    };
    brokers.push(newBroker);
    fs.writeFileSync(brokersFile, JSON.stringify(brokers, null, 2));
    return newBroker;
  }

  changeMoney(
    id: number,
    money: number,
    brokersFile = brokersFileDefault,
  ): Broker {
    const brokers: Broker[] = JSON.parse(
      fs.readFileSync(brokersFile).toString(),
    );
    const broker = brokers.find((broker) => broker.id === id);
    broker.money = money;
    fs.writeFileSync(brokersFile, JSON.stringify(brokers, null, 2));
    return broker;
  }

  deleteBrokerService(id: number, brokersFile = brokersFileDefault) {
    let brokers: Broker[] = JSON.parse(fs.readFileSync(brokersFile).toString());
    brokers = brokers.filter((broker) => broker.id !== id);
    fs.writeFileSync(brokersFile, JSON.stringify(brokers, null, 2));
  }
}

export type Broker = { id: number; name: string; money: number };
