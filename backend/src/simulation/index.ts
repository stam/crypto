import { round } from 'lodash';
import { Order } from '../market';
import Tick from '../models/tick';
import MockMarket from '../market/mock';
import BaseStrategy from '../strategy/base';

class Trade {
  buyPrice: number;
  sellPrice: number;
  result: number;
  buyDate: Date;
  sellDate: Date;

  constructor(order: Order) {
    this.buyPrice = order.price;
    this.buyDate = order.date;
  }

  sell(order: Order) {
    this.sellPrice = order.price;
    this.sellDate = order.date;
    this.result = round((100 * order.price) / this.buyPrice, 1);
  }
}

/*
 * A backtest simulation for a crypto strategy
 *
 * Feeds ticks to a strategy.
 * Supplies the strategy with a Market interface
 * Keeps track of the orders placed in the market
 * and tries to bundle them into trades.
 */
class Simulation {
  market: MockMarket;
  ticks: Tick[];
  strategy: BaseStrategy;

  constructor({
    strategy,
    market,
  }: {
    strategy: BaseStrategy;
    market: MockMarket;
  }) {
    this.market = market;
    this.strategy = strategy;
  }

  async run() {
    this.market.addTickListener(this.strategy);

    while(this.market.hasTicks) {
      await this.market.tick();
    }
  }
}

export default Simulation;
