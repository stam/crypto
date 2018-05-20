import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import CandleChart from '../component/CandleChart';

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
            <div className="fill">
                {!this.data && <p>Loading</p>}
                {this.data && <CandleChart data={this.data} />}
            </div>
        );
    }
}

export default CoinValue;
