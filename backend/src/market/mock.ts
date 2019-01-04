import { uniqueId } from 'lodash';

export class InsufficientFiatError extends Error {};
export class InsufficientCryptoError extends Error {};

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

export default class Market {
  accountValue: number = 0;
  accountFiat: number = 0;

  // For now just allow any price
  async createOrder({ price, quantity, type }: { price: number, quantity: number, type: string}) {
    if (type === 'buy') {
      if (price * quantity > this.accountFiat) {
        throw new InsufficientFiatError();
      }
    } else if (type === 'sell') {
      if (quantity > this.accountValue) {
        throw new InsufficientCryptoError();
      }
    }
    const order = new Order({
      date: new Date('2018-03-07T00:00:00.000Z'),
      quantity,
      price,
      type,
    });

    if (type === 'buy') {
      this.accountValue += quantity;
      this.accountFiat -= price * quantity;
    } else if (type === 'sell') {
      this.accountValue -= quantity;
      this.accountFiat += price * quantity;
    }

    return order;
  }
}
