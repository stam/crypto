import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import CandleChart from '../component/CandleChart';

@observer
class SimulationValue extends Component {
    render() {
        return (
            <div className="fill">
                <p />
            </div>
        );
    }
}

export default SimulationValue;
