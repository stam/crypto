import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import PropTypes from 'prop-types';

@observer
class SimulationForm extends Component {
    @observable.ref data;

    static propTypes = {
        setSimulation: PropTypes.func.isRequired,
    };

    handleSubmit = e => {
        e.preventDefault();
        fetch('/api', {
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
                        }
                    }`,
            }),
        })
            .then(res => res.json())
            .then(res => {
                this.props.setSimulation(res.data.runSimulation);
            });
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
