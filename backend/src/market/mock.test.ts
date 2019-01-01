import Market from './mock';

describe('The market', () => {

  it('holds an account value for both fiat and crypto', () => {
    const market = new Market();
    expect(market.accountValue).toBe(0);
    expect(market.accountFiat).toBe(0);
  });

  describe('when buying', () => {
    it('returns a promise which resolves in an order of that price and quantity', async () => {
      const market = new Market();
      market.accountFiat = 1000;
      market.accountValue = 0;
      const order = await market.createOrder({
        price: 1000,
        quantity: 1,
        type: 'buy',
      });

      expect(order.price).toBe(1000)
      expect(order.quantity).toBe(1)
      expect(order.type).toBe('buy')
    });

    it('fails when the balance is insufficient', async () => {
      const market = new Market();
      market.accountFiat = 1000;
      market.accountValue = 0;

      expect(() => {
        market.createOrder({
          price: 501,
          quantity: 2,
          type: 'buy',
        });
      }).toThrow();

      expect(() => {
        market.createOrder({
          price: 1100,
          quantity: 1,
          type: 'buy',
        });
      }).toThrow();
    });

    it('updates the account after a successful buy', async () => {
      const market = new Market();
      market.accountFiat = 1000;
      market.accountValue = 0;

      await market.createOrder({
        price: 100,
        quantity: 2,
        type: 'buy',
      });

      expect(market.accountValue).toBe(2)
      expect(market.accountFiat).toBe(800)
    });
  });
});
