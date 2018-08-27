import { observable } from 'mobx';
import BaseModel from './Base';

export default class Simulation extends BaseModel {
  @observable from;
  @observable to;
  @observable orders;
  @observable trades;

  @observable _loading = false;

  async fetch() {
    this._loading = true;
    const response = await fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `mutation {
          runSimulation(
            startDate: "2018-01-01",
            endDate: "2018-12-31",
            startValue: "7000USD"
          ) {
            from
            to
            orders {
              timestamp
              type
              quantity
              price
            }
            trades {
              costBasis
              marketValue
              result
            }
          }
      }`,
      }),
    });

    const res = await response.json();
    this.parse(res.data.runSimulation);
    this._loading = false;
  }
}
