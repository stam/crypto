import Asset from '../strategy/asset';

class Market {
  createOrder: any;
  onAssetSell?(asset: Asset): () => void;
  Asset: any;

  constructor({ createOrder }) {
    this.createOrder = createOrder;
  }

  buy(price: number, quantity: number) {
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

  handleAssetSell(asset: Asset, price: number) {
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
