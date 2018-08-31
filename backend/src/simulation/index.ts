import { round, each, values, uniqueId } from 'lodash';
import Market, { Order } from '../market';
import Strategy from '../strategy';
import Tick from '../models/tick';


class Trade {
  marketValue: number;
  result: number;
  costBasis: number;
  constructor(order: Order) {
    this.costBasis = order.price;
  }

  sell(order: Order) {
    this.marketValue = order.price;
    this.result = round(100 * order.price / this.costBasis, 1);
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
  openTrades: {
    [key: number]: Trade,
  }
  strategy: Strategy;
  orders: Order[];

  constructor({ ticks, Strategy }: { ticks: Tick[], Strategy: any}) {
    this.ticks = ticks;

    this.market = new Market({
      saveOrder: this.handleOrder.bind(this),
    })

    this.trades = [];
    this.openTrades = {};
    this.orders = [];
    this.strategy = new Strategy(this.market);
  }

  run() {
    each(this.ticks, (tick) => {
      this.strategy.handleTick(tick);
    });

    this.trades = values(this.trades);
  }

  handleOrder(order: Order) {
    this.orders.push(order);

    if (order.type === 'buy') {
      const trade = new Trade(order);
      this.trades.push(trade);
      this.openTrades[order.quantity] = trade;
      return;
    }

    const trade = this.openTrades[order.quantity];

    // It could be that we don't fully sell the bitcoin we have.
    // TODO: keep buy orders open, sorted by date
    // when selling, fill open orders from start to end
    if (trade) {
      trade.sell(order);
      // remove trade from index
    }

  }
}

export default Simulation;
