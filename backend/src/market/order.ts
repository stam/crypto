import { uniqueId } from 'lodash';
import Tick from '../models/tick';

export enum OrderSide {
  BUY = 'buy',
  SELL = 'sell'
}

export enum OrderType {
  LIMIT = 'limit',
  MARKET = 'market', // NYI
  STOP_LOSS = 'stop-loss', // NYI
  STOP_LOSS_LIMIT = 'stop-loss-limit', // NYI
  TAKE_PROFIT = 'take-profit', // NYI
  TAKE_PROFIT_LIMIT = 'take-profit-limit', // NYI
  LIMIT_MAKER = 'limit-maker', // NYI
}

type OrderCallback = (order: Order) => void;

export interface OrderSummary {
  price: number;
  resultPrice: number;
  quantity: number;
  side: OrderSide;
  type: OrderType;
  date: Date;
}

export default class Order {
  id: string;
  quantity: number;
  pending: boolean = true;
  side: OrderSide;
  type: OrderType;
  onResolve?: OrderCallback;
  onReject?: OrderCallback;
  date?: Date;
  price?: number;
  resultPrice?: number;

  constructor(type: OrderType, side: OrderSide, quantity: number, price?: number) {
    if (price === undefined && type !== OrderType.MARKET) {
      throw new Error('Price required for non-market orders');
    }

    this.id = uniqueId();
    this.type = type;
    this.side = side;
    this.quantity = quantity;
    this.price = price;
  }

  // TODO, make a migration like structure for adding and subtracting account value
  resolve(price: number, date: Date = new Date()) {
    this.pending = false;

    this.date = date;
    this.resultPrice = price;

    if (this.onResolve) {
      this.onResolve(this);
    }
  }

  reject() {
    if (this.onReject) {
      this.onReject(this);
    }
  }

  public toSummary() : OrderSummary {
    return {
      price: this.price,
      resultPrice: this.resultPrice,
      quantity: this.quantity,
      side: this.side,
      date: this.date,
      type: this.type,
    }
  }

  // Backtest purposes uses only
  checkIfResolves(tick: Tick) : boolean {
    if (this.type === OrderType.MARKET) {
      return true;
    }
    if (this.type === OrderType.LIMIT) {
      if (this.side === OrderSide.BUY && tick.last <= this.price) {
        return true;
      } else if (this.side === OrderSide.SELL && tick.last >= this.price) {
        return true;
      }
      return false
    }
    throw new Error('Not implemented');
  }
}
