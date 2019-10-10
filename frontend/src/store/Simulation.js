import { observable } from 'mobx';
import BaseModel from './Base';

export default class Simulation extends BaseModel {
  @observable from;
  @observable to;
  @observable orders;
  @observable trades;
  @observable startBalance;
  @observable endBalance;
  @observable profit;

  @observable startValue = 1;
  @observable startFiat = 0;

  @observable _loading = false;

  async fetch() {
    this._loading = true;
    const response = await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `mutation {
          runSimulation(
            startValue: ${this.startValue}
            startFiat: ${this.startFiat}
          ) {
            orders {
              date
              type
              side
              quantity
              resultPrice
              price
            }
            trades {
              buyPrice
              buyDate
              quantity
              sellPrice
              sellDate
              result
            }
            startBalance
            endBalance
            profit
          }
      }`,
      }),
    });

    const res = await response.json();
    this.parse(res.data.runSimulation);
    this._loading = false;
  }
}
