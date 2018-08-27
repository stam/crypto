// import Asset from '../strategy/asset';
import { Order } from '../simulation';

class Market {
  saveOrder?(order: Order): () => void;
  // onAssetSell?(asset: Asset): () => void;
  // Asset: any;

  constructor({ saveOrder }) {
    this.saveOrder = saveOrder;
  }

  buy(tick: any, quantity: number) {
    // const asset = new this.Asset(tick.get('last'), quantity, tick.get('timestamp'));

    // How to clean this up?
    // asset.handleSell = (price) => {
    //   this.handleAssetSell(asset, price)
    // };

    return this.createOrder({
      date: tick.get('timestamp'),
      price: tick.get('last'),
      type: 'buy',
      quantity,
    });
  }

  sell(tick: any, quantity: number) {
    return this.createOrder({
      date: tick.get('timestamp'),
      price: tick.get('last'),
      type: 'sell',
      quantity,
    });
  }

  createOrder({ date, type, price, quantity }: { date: string; type: string; price: number; quantity: number }) {
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

  // handleAssetSell(asset: Asset, price: number) {
  //   this.createOrder({
  //     type: 'sell',
  //     asset,
  //     price,
  //   })

  //   if (this.onAssetSell) {
  //     this.onAssetSell(asset);
  //   }
  // }
}

export default Market;
