import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

@observer
class Orders extends Component {
    static propTypes = {
        simulation: PropTypes.object,
    };

    renderOrder(order, i) {
        return (
            <li key={order.timestamp}>
                {order.timestamp} {order.type} {order.price}
            </li>
        );
    }

    render() {
        const { simulation } = this.props;
        return (
            <div className="toolbar">
                {!simulation && <p>No simulation active</p>}
                {simulation && (
                    <ul>{simulation.orders.map(this.renderOrder)}</ul>
                )}
            </div>
        );
    }
}

export default Orders;
