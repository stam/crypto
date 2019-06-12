import { uniqueId } from 'lodash';
import Tick from '../models/tick';

export class InsufficientFiatError extends Error {}
export class InsufficientCryptoError extends Error {}

export enum OrderType {
  BUY = 'buy',
  SELL = 'sell'
}

export class Order {
  id: string;
  date: Date;
  quantity: number;
  price: number;
  type: OrderType;

  constructor({
    date,
    quantity,
    price,
    type,
  }: {
    date: Date;
    quantity: number;
    price: number;
    type: OrderType;
  }) {
    this.id = uniqueId();
    this.date = date;
    this.quantity = quantity;
    this.price = price;
    this.type = type;
  }
}

interface TickListener {
  handleTick(t: Tick);
}

export default abstract class BaseMarket {
  accountValue: number;
  accountFiat: number;
  listeners: TickListener[] = [];

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

  // For now just allow any price
  protected async createOrder({ price, quantity, type }: { price: number; quantity: number; type: OrderType }) {
    if (type === OrderType.BUY) {
      if (price * quantity > this.accountFiat) {
        throw new InsufficientFiatError();
      }
    } else if (type === OrderType.SELL) {
      if (quantity > this.accountValue) {
        throw new InsufficientCryptoError();
      }
    }

    const order = await this.placeOrder(price, quantity, type);

    if (type === OrderType.BUY) {
      this.accountValue += quantity;
      this.accountFiat -= price * quantity;
    } else if (type === OrderType.SELL) {
      this.accountValue -= quantity;
      this.accountFiat += price * quantity;
    }

    return order;
  }

  abstract async checkIfOrdersResolve(tick: Tick) : Promise<void>

  get timestamp() {
    return Date.now();
  }

  addTickListener(listener: TickListener) {
    this.listeners.push(listener);
  }

  protected abstract async queryTick() : Promise<Tick>;
  protected async placeOrder(price: number, quantity: number, type: OrderType) {
    return new Order({
      date: new Date('2018-03-07T00:00:00.000Z'),
      quantity,
      price,
      type,
    });
  }

  async tick() {
    const tick = await this.queryTick();

    await this.checkIfOrdersResolve(tick);

    for (let listener of this.listeners) {
      // TODO, listener should not be an object,
      // it should just be the callback
      listener.handleTick(tick);
    }


    return tick;
  }

  buy(price: number, quantity: number) {
    return this.createOrder({
      type: OrderType.BUY,
      quantity,
      price,
    });
  }

  sell(price: number, quantity: number) {
    return this.createOrder({
      type: OrderType.SELL,
      quantity,
      price,
    });
  }
}
