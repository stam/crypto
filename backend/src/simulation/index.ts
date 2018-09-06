import { round, each, values, uniqueId } from 'lodash';
import Market, { Order } from '../market';
import Strategy from '../strategy/example/simple';
import Tick from '../models/tick';


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
    this.result = round(100 * order.price / this.buyPrice, 1);
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
  ticks: Tick[];
  market: Market;
  trades: Trade[];
  openTrades: Trade[];
  strategy: Strategy;
  orders: Order[];

  constructor({ ticks, Strategy }: { ticks: Tick[], Strategy: any}) {
    this.ticks = ticks;

    this.market = new Market({
      saveOrder: this.handleOrder.bind(this),
    })

    this.trades = [];
    this.openTrades = [];
    this.orders = [];
    this.strategy = new Strategy(this.market);
  }

  async run() {
    for (const tick of this.ticks) {
      await this.strategy.handleTick(tick);
    };

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
