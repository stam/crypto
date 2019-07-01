import { round, remove, last} from 'lodash';
import { Order, OrderType } from '../market';
import Tick from '../models/tick';
import MockMarket from '../market/mock';
import BaseStrategy from '../strategy/base';

class Trade {
  buyPrice: number;
  sellPrice: number;
  result: number;
  quantity: number;
  buyDate: Date;
  sellDate: Date;

  constructor(buyPrice: number, quantity: number, buyDate: Date) {
    this.buyPrice = buyPrice;
    this.quantity = quantity
    this.buyDate = buyDate;
  }

  sell(sellOrder: Order): Trade | undefined {
    this.sellPrice = sellOrder.price;
    this.sellDate = sellOrder.date;
    this.result = round((100 * sellOrder.price) / this.buyPrice, 1);

    if (this.quantity > sellOrder.quantity) {
      const remainingQuantity = this.quantity - sellOrder.quantity;
      this.quantity = sellOrder.quantity;
      return new Trade(this.buyPrice, remainingQuantity, this.buyDate);
    }

    return;
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
  orders: Order[] = [];
  trades: Trade[] = [];
  private openTrades: Trade[] = [];
  startBalance: number;
  endBalance?: number;
  profit: number;
  strategy: BaseStrategy;

  constructor({
    strategy,
    market,
  }: {
    strategy: BaseStrategy;
    market: MockMarket;
  }) {
    this.market = market;
    this.market.onPlaceOrder = this.handleOrder.bind(this);
    this.strategy = strategy;
  }

  async run() {
    this.startBalance = this.calculateBalance(this.market.ticks[0]);
    while (this.market.hasTicks) {
      await this.market.tick();
    }
    this.endBalance = this.calculateBalance(last(this.market.ticks));
    this.profit = round(this.endBalance * 100/ this.startBalance, 1);
  }

  calculateBalance(tick: Tick) {
    const fiatValue = this.market.accountFiat;
    const cryptoValue = this.market.accountValue * tick.last;

    return Math.round((fiatValue + cryptoValue) / 100);
  }

  handleOrder(order: Order) {
    this.orders.push(order);
    // this.openTrades.push(new Trade(order));
    this.matchOrderIntoTrades(order);
  }

  matchOrderIntoTrades(order: Order) {
    if (order.type === OrderType.SELL && this.openTrades.length === 0) {
      const startingTrade = new Trade(null, order.quantity, null);
      startingTrade.sellPrice = order.price;
      startingTrade.sellDate = order.date;
      this.trades.push(startingTrade)
      return;
    }

    if (order.type === OrderType.BUY) {
      const newTrade = new Trade(order.price, order.quantity, order.date);
      this.openTrades.push(newTrade);
      return;
    }

    const trade = this.openTrades[0];
    let remainingTrade = trade.sell(order);

    remove(this.openTrades, (trade: Trade, i) => {
      return i === 0;
    })

    this.trades.push(trade);

    if (remainingTrade) {
      this.openTrades.unshift(remainingTrade);
    }
  }
}

export default Simulation;
