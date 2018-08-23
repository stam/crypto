import React, { Component } from 'react';
import { observer } from 'mobx-react';

import SimulationForm from './SimulationForm';
import CoinValue from './CoinValue';
import Orders from './Orders';
import SimulationValue from './SimulationValue';
import { observable } from 'mobx';

@observer
class App extends Component {
  @observable simulation;

  setSimulation = simulation => {
    this.simulation = simulation;
  };

  render() {
    return (
      <main>
        <div className="flex-row">
          <SimulationForm setSimulation={this.setSimulation} />
          <CoinValue />
        </div>
        <div className="flex-row">
          <Orders simulation={this.simulation} />
          <SimulationValue />
        </div>
      </main>
    );
  }
}

export default App;
