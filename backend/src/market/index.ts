import { uniqueId } from 'lodash';
import Tick from '../models/tick';
import Order, { OrderSide, OrderType } from './order';

export class InsufficientFiatError extends Error { }
export class InsufficientCryptoError extends Error { }

// export class Order {
//   id: string;
//   date: Date;
//   quantity: number;
//   price: number;
//   side: OrderSide;
//   type: OrderType;

//   constructor({
//     date,
//     quantity,
//     price,
//     side,
//     type,
//   }: {
//     date: Date;
//     quantity: number;
//     price: number;
//     side: OrderSide;
//     type: OrderType;
//   }) {
//     this.id = uniqueId();
//     this.date = date;
//     this.quantity = quantity;
//     this.price = price;
//     this.side = side;
//     this.type = type;
//   }
// }

type TickCallback = (tick: Tick) => void;

// export interface PendingOrder {
//   price?: number;
//   quantity: number;
//   side: OrderSide;
//   type: OrderType;
//   resolve: (order: Order) => void;
// }

export default abstract class BaseMarket {
  accountValue: number;
  accountFiat: number;
  listeners: TickCallback[] = [];

  unfullfilledOrders: Order[] = [];

  constructor(
    {
      accountFiat,
      accountValue,
    }: {
      accountFiat: number;
      accountValue: number;
    } = { accountFiat: 0, accountValue: 0 },
  ) {
    this.accountFiat = accountFiat;
    this.accountValue = accountValue;
  }

  async createOrder(type: OrderType, side: OrderSide, quantity: number, price?: number) {
    if (type === OrderType.LIMIT && side === OrderSide.BUY) {
      if (price * quantity > this.accountFiat) {
        throw new InsufficientFiatError();
      }
    } else if (type === OrderType.LIMIT && side === OrderSide.SELL) {
      if (quantity > this.accountValue) {
        throw new InsufficientCryptoError();
      }
    }

    const order = await this.placeOrder(type, side, quantity, price);

    if (side === OrderSide.BUY) {
      this.accountValue += quantity;
    } else if (side === OrderSide.SELL) {
      this.accountFiat += order.price * quantity;
    }

    return order;
  }

  abstract async checkIfOrdersResolve(tick: Tick): Promise<void>

  get timestamp() {
    return Date.now();
  }

  addTickListener(listener: TickCallback) {
    this.listeners.push(listener);
  }

  protected abstract async queryTick(): Promise<Tick>;
  abstract async placeOrder(type: OrderType, side: OrderSide, quantity: number, price?: number)

  async tick() {
    const tick = await this.queryTick();

    await this.checkIfOrdersResolve(tick);

    for (let callback of this.listeners) {
      await callback(tick);
    }

    return tick;
  }

  buy(price: number, quantity: number) {
    return this.createOrder(OrderType.LIMIT, OrderSide.BUY, quantity, price);
  }

  sell(price: number, quantity: number) {
    return this.createOrder(OrderType.LIMIT, OrderSide.SELL, quantity, price);
  }
}
