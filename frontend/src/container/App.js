import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';

import SimulationForm from './SimulationForm';
import CoinValue from './CoinValue';
import Orders from './Orders';
import SimulationValue from './SimulationValue';

@observer
class App extends Component {
    render() {
        return (
            <main>
                <div className="flex-row">
                    <SimulationForm />
                    <CoinValue />
                </div>
                <div className="flex-row">
                    <Orders />
                    <SimulationValue />
                </div>
            </main>
        );
    }
}

export default App;
