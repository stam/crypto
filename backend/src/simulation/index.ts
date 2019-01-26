import { round, each, values, uniqueId } from 'lodash';
import { Order } from '../market/base';
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
  trades: Trade[];
  openTrades: Trade[];
  strategy: BaseStrategy;
  orders: Order[];

  constructor({
    strategy,
    market,
    startFiat = 0,
    startValue = 0,
  }: {
    strategy: BaseStrategy;
    market: MockMarket;
    startFiat?: number;
    startValue?: number;
  }) {
    this.market = market;

    this.trades = [];
    this.openTrades = [];
    this.orders = [];
    this.strategy = strategy;
  }

  async run() {
    for (const tick of this.market.ticks) {
      await this.strategy.handleTick(tick);
    }

    this.trades = values(this.trades);
  }

  handleOrder(order: Order) {
    this.orders.push(order);

    if (order.type === 'buy') {
      const trade = new Trade(order);
      this.trades.push(trade);
      this.openTrades.push(trade);
      return;
    }

    const trade = this.openTrades[0];

    // It could be that we don't fully sell the bitcoin we have.
    if (trade) {
      trade.sell(order);
      // TODO: keep buy orders open, sorted by date
      // when selling, fill open orders from start to end
      // remove trade from index
      this.openTrades.splice(0, 1);
    }
  }
}

export default Simulation;
