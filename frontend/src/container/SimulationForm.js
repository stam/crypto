import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class SimulationForm extends Component {
    handleSubmit = e => {
        e.preventDefault();
    };
    render() {
        return (
            <form onSubmit={this.handleSubmit} className="toolbar">
                <p>Simulate</p>
                <button>Run</button>
            </form>
        );
    }
}

export default SimulationForm;
