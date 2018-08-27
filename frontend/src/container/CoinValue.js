import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import styled from 'styled-components';

import CandleChart from '../component/CandleChart';

const Container = styled.div`
  grid-row: 2 / 10;
  grid-column: 2 / -1;
`;

function parseData(data) {
  return data.candles.map(candle => ({
    id: candle.id,
    open: candle.open / 100,
    close: candle.close / 100,
    low: candle.low / 100,
    high: candle.high / 100,
    date: new Date(candle.datetime),
  }));
}

@observer
class CoinValue extends Component {
  @observable.ref data;

  componentWillMount() {
    fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: '{ candles { id open close low high datetime} }',
      }),
    })
      .then(res => res.json())
      .then(res => {
        this.data = parseData(res.data);
      });
  }
  render() {
    return (
      <Container>
        {!this.data && <p>Loading</p>}
        {this.data && <CandleChart data={this.data} />}
      </Container>
    );
  }
}

export default CoinValue;
