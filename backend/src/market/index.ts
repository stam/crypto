import { uniqueId } from 'lodash';
import Tick from '../models/tick';

export class Order {
  id: string;
  date: Date;
  quantity: number;
  price: number;
  type: string;

  constructor({ date, quantity, price, type }: {
    date: Date;
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

class Market {
  saveOrder?(order: Order): () => void;

  constructor({ saveOrder }) {
    this.saveOrder = saveOrder;
  }

  buy(tick: Tick, quantity: number) {
    return this.createOrder({
      date: tick.timestamp,
      price: tick.last,
      type: 'buy',
      quantity,
    });
  }

  sell(tick: any, quantity: number) {
    return this.createOrder({
      date: tick.timestamp,
      price: tick.last,
      type: 'sell',
      quantity,
    });
  }

  createOrder({ date, type, price, quantity }: { date: Date; type: string; price: number; quantity: number }) {
    console.info(`> Creating ${type} order: quantity ${quantity}, price: ${price}`)
    const order = new Order({
      date,
      type,
      price,
      quantity,
    });

    this.saveOrder(order);

    return order;
  }
}

export default Market;
