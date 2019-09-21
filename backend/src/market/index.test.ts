import BaseMarket, { InsufficientFiatError, InsufficientCryptoError } from '.';
import Order, { OrderType, OrderSide} from './order';
import Tick from '../models/tick';

class DumbMarket extends BaseMarket {
  // Executes every order without looking at the price
  async queryTick() {
    return new Tick();
  }

  async placeOrder() {
    return new Order(OrderType.LIMIT, OrderSide.BUY, 1, 1000);
  }

  async checkIfOrdersResolve() {}
}

describe('The market', () => {
  it('holds an account value for both fiat and crypto', () => {
    const market = new DumbMarket();
    expect(market.accountValue).toBe(0);
    expect(market.accountFiat).toBe(0);
  });

  describe('when buying', () => {
    it('fails when the balance is insufficient', async () => {
      const market = new DumbMarket();
      market.accountFiat = 1000;
      market.accountValue = 0;

      const invalidDoubleOrder = market.buy(501, 2);

      await expect(invalidDoubleOrder).rejects.toThrow(InsufficientFiatError);

      const invalidSingleOrder = market.buy(1100, 1);

      await expect(invalidSingleOrder).rejects.toThrow(InsufficientFiatError);
    });

  });

  describe('when sellings', () => {
    it('fails when the crypto value is insufficient', async () => {
      const market = new DumbMarket();
      market.accountFiat = 0;
      market.accountValue = 1;

      const invalidOrder = market.sell(501, 1.1);

      await expect(invalidOrder).rejects.toThrow(InsufficientCryptoError);
    });
  });
});
