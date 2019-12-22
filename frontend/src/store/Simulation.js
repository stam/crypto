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
  @observable startDate = '';
  @observable strategy = 'ema';
  @observable endDate = '2018-08-06';

  @observable _loading = false;

  async fetch() {
    this._loading = true;
    const response = await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `mutation($startValue: Float!, $startFiat: Int!, $strategy: String!, $startDate: Date, $endDate: Date) {
          runSimulation(
            startValue: $startValue
            startFiat: $startFiat
            strategy: $strategy
            startDate: $startDate
            endDate: $endDate
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
        variables: {
          strategy: this.strategy,
          startValue: this.startValue,
          startFiat: this.startFiat,
          startDate: this.startDate,
          endDate: this.endDate,
        },
      }),
    });

    const res = await response.json();
    this.parse(res.data.runSimulation);
    this._loading = false;
  }
}
