import BaseMarket, { InsufficientFiatError, InsufficientCryptoError } from '.';
import Tick from '../models/tick';

class DumbMarket extends BaseMarket {
  // Executes every order without looking at the price
  async queryTick() {
    return new Tick();
  }
}

describe('The market', () => {
  it('holds an account value for both fiat and crypto', () => {
    const market = new DumbMarket();
    expect(market.accountValue).toBe(0);
    expect(market.accountFiat).toBe(0);
  });

  describe('when buying', () => {
    it('returns a promise which resolves in an order of that price and quantity', async () => {
      const market = new DumbMarket();
      market.accountFiat = 1000;
      market.accountValue = 0;
      const order = await market.buy(1000, 1);

      expect(order.price).toBe(1000)
      expect(order.quantity).toBe(1)
      expect(order.type).toBe('buy')
    });

    it('fails when the balance is insufficient', async () => {
      const market = new DumbMarket();
      market.accountFiat = 1000;
      market.accountValue = 0;

      const invalidDoubleOrder = market.buy(501, 2);

      await expect(invalidDoubleOrder).rejects.toThrow(InsufficientFiatError);

      const invalidSingleOrder = market.buy(1100, 1);

      await expect(invalidSingleOrder).rejects.toThrow(InsufficientFiatError);
    });

    it('updates the account after a successful buy', async () => {
      const market = new DumbMarket();
      market.accountFiat = 1000;
      market.accountValue = 0;

      await market.buy(100, 2);

      expect(market.accountValue).toBe(2)
      expect(market.accountFiat).toBe(800)
    });
  });

  describe('when sellings', () => {
    it('returns a promise which resolves in an order of that price and quantity', async () => {
      const market = new DumbMarket();
      market.accountFiat = 1000;
      market.accountValue = 1;
      const order = await market.sell(1000, 1);

      expect(order.price).toBe(1000)
      expect(order.quantity).toBe(1)
      expect(order.type).toBe('sell')
    });

    it('fails when the crypto value is insufficient', async () => {
      const market = new DumbMarket();
      market.accountFiat = 0;
      market.accountValue = 1;

      const invalidOrder = market.sell(501, 1.1);

      await expect(invalidOrder).rejects.toThrow(InsufficientCryptoError);
    });

    it('updates the account after a successful sell', async () => {
      const market = new DumbMarket();
      market.accountFiat = 1000;
      market.accountValue = 2;

      await market.sell(1000, 1);

      expect(market.accountValue).toBe(1)
      expect(market.accountFiat).toBe(2000)
    });
  });
});
