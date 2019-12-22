import { values } from 'lodash';

import Tick from '../../models/tick';
import BaseStrategy from '../base';
import Market from '../../market';
import Indicator from '../../indicator';
import { OrderType, OrderSide } from '../../market/order';

class EmaTrade {
  market: Market;
  buyIn: number;
  quantity: number;

  stopLoss: number;
  takeProfit: number;

  constructor(market: Market, tick: Tick, quantity: number) {
    this.market = market;
    this.quantity = quantity;
    this.buyIn = tick.last;

    this.market.createOrder(OrderType.MARKET, OrderSide.BUY, quantity);

    this.stopLoss = Math.round(this.buyIn * 0.95);
    this.takeProfit = Math.round(this.buyIn * 1.1);
  }

  handleTick(tick: Tick): boolean {
    if (tick.last <= this.stopLoss || tick.last >= this.takeProfit) {
      this.market.createOrder(OrderType.MARKET, OrderSide.SELL, this.quantity);
      return true;
    }
    return false;
  }
}

class EmaStrategy extends BaseStrategy {
  indicators: { [key: string]: Indicator } = {};
  trades: EmaTrade[] = [];
  tradeQuantity = 0.25;

  constructor(market: Market) {
    super(market);

    this.addIndicator('EMA', 7);
    this.addIndicator('EMA', 14);
  }

  addIndicator(name: string, period: number) {
    const indicator = new Indicator(name, period);
    this.indicators[`${name}${period}`] = indicator;
  }

  updateIndicators(tick: Tick) {
    const promises = values(this.indicators).map(indicator =>
      indicator.handleTick(tick.last, tick.timestamp),
    );
    return Promise.all(promises);
  }

  async handleTick(tick: Tick) {
    await this.updateIndicators(tick);

    const indexesToRemove: number[] = [];

    this.trades.forEach((trade, index: number) => {
      const sold = trade.handleTick(tick);
      if (sold) {
        indexesToRemove.push(index);
      }
    });

    indexesToRemove.forEach(index => {
      this.trades.splice(index, 1);
    });

    const emaShort = this.indicators.EMA7;
    const emaLong = this.indicators.EMA14;

    if (emaShort.result === null || emaLong.result === null) {
      return;
    }

    if (emaShort.result > emaLong.result) {
      this.signalBuy(tick);
    }
  }

  removeTrade(trade: EmaTrade) {}

  // Buy if we have no crypto
  signalBuy(tick: Tick) {
    if (this.market.accountFiat > this.tradeQuantity * tick.last) {
      this.addTrade(tick, this.tradeQuantity);
    }
  }

  addTrade(tick: Tick, quantity: number) {
    const trade = new EmaTrade(this.market, tick, quantity);
    this.trades.push(trade);
  }

  // signalSell(tick: Tick) {
  //   if (!this.market.unfullfilledOrders.length && this.market.accountValue >= 1) {
  //     this.market.createOrder(OrderType.MARKET, OrderSide.SELL, 1);
  //   }
  // }
}

export default EmaStrategy;
