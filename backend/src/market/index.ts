interface Market {
  // createOrder?(x: {}): () => any;
  createOrder: any;
  onAssetSell?(asset: any): () => void;
  Asset: any;
}

class Market {
  constructor({ createOrder }) {
    this.createOrder = createOrder;
  }

  buy({ price, quantity }) {
    const asset = new this.Asset(price, quantity);

    // How to clean this up?
    asset.handleSell = (price) => {
      this.handleAssetSell(asset, price)
    };

    this.createOrder({
      type: 'buy',
      price: asset.cost,
      asset,
    });
    return asset;
  }

  handleAssetSell(asset, price) {
    this.createOrder({
      type: 'sell',
      asset,
      price,
    })

    if (this.onAssetSell) {
      this.onAssetSell(asset);
    }
  }
}

export default Market;
