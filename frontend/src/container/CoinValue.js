import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import styled from 'styled-components';

import CandleChart from '../component/CandleChart';

const Container = styled.div`
  grid-row: 2 / 10;
  grid-column: 1 / -1;
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

class CoinValue extends Component {
  static propTypes = {
    simulation: PropTypes.object.isRequired,
  };

  componentWillMount() {
    fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: '{ candles { id open close low high datetime} }',
      }),
    })
      .then(async res => {
        if (!res.ok) {
          const response = await res.text();
          throw Error(response);
        }
        return res.json();
      })
      .then(res => {
        this.data = parseData(res.data);
      })
      .catch(e => {
        console.error('Error', e);
      });
  }

  @observable.ref data;

  render() {
    const { simulation } = this.props;
    return (
      <Container>
        {!this.data && <p>Loading</p>}
        {this.data && <CandleChart data={this.data} simulation={simulation} />}
      </Container>
    );
  }
}

export default observer(CoinValue);
