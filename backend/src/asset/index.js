class Asset {
  constructor(cost, quantity, handleSell) {
    this.cost = cost;
    this.quantity = quantity;
    this.handleSell = handleSell;
    this.id = Date.now();
  }

  handleTick(tick) {
    const value = parseInt(tick.get('last') / 100);
    if (value >= 9500) {
      this.handleSell(tick.get('last'));
    }
  }
}


module.exports = Asset;
