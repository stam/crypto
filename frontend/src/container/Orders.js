import React, { Component } from 'react';
import { observer } from 'mobx-react';

@observer
class Orders extends Component {
    render() {
        return (
            <div className="toolbar">
                <p>No simulation active</p>
            </div>
        );
    }
}

export default Orders;
