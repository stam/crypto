import { round, each, values, uniqueId } from 'lodash';
import Market from '../market';
// import Asset from '../strategy/asset';
import Strategy from '../strategy';


export class Order {
  id: string;
  date: string;
  quantity: number;
  price: number;
  type: string;

  constructor({ date, quantity, price, type }: {
    date: string;
    quantity: number;
    price: number;
    type: string;
  }) {
    this.id = uniqueId();
    this.date = date;
    this.quantity = quantity;
    this.price = price;
    this.type = type;
  }
}

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

class Simulation {
  ticks: any;
  market: Market;
  trades: Trade[];
  openTrades: {
    [key: number]: Trade,
  }
  strategy: Strategy;
  orders: Order[];

  constructor({ ticks, Strategy }: { ticks: any[], Strategy: any}) {
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
    if (trade) {
      trade.sell(order);
      // remove trade from index
    }

  }
}

export default Simulation;
