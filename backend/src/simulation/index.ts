import { round, each, values } from 'lodash';
import Market from '../market';
import Asset from '../strategy/asset';
import Strategy from '../strategy';

class Trade {
  marketValue: number;
  result: number;
  costBasis: number;
  constructor(asset: Asset) {
    this.costBasis = asset.cost;
  }

  sell(value: number) {
    this.marketValue = value;
    this.result = round(100 * value / this.costBasis, 1);
  }
}

export interface Order {
  timestamp: string;
  quantity: number;
  price: number;
  type: string;
}

class Simulation {
  ticks: any;
  market: Market;
  trades: {
    [key: number]: Trade,
  };
  strategy: Strategy;
  orders: Order[];

  constructor({ ticks, Strategy }: { ticks: any[], Strategy: any}) {
    this.ticks = ticks;

    this.market = new Market({
      createOrder: this.handleOrder.bind(this),
    })

    this.trades = {};
    this.orders = [];
    this.strategy = new Strategy(this.market);
  }

  run() {
    each(this.ticks, (tick) => {
      this.strategy.handleTick(tick);
    });

    this.trades = values(this.trades);
  }

  handleOrder({ price, type, asset }: { price: number, type: string, asset: Asset}) {
    console.info(`> Creating ${type} order: quantity ${asset.quantity}, price: ${price}`)
    const now = new Date();

    const order: Order = {
      timestamp: now.toISOString(),
      quantity: asset.quantity,
      price,
      type,
    };

    this.orders.push(order);

    if (type === 'buy') {
      const trade = new Trade(asset);
      this.trades[asset.id] = trade;
    } else {
      const trade = this.trades[asset.id];
      trade.sell(price);

    }
    return order;
  }
}

export default Simulation;
