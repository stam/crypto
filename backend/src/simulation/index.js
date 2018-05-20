const db = require('../models');
const _ = require('lodash');


// Dummy strategy, buys at 7000, sells at 9500
// Without state: doesn't check how much fund is available or active orders
class Strategy {
    constructor() {
        this.activeOrder = null;
        this.orders = [];
    }

    handleTick(tick) {
        const value = parseInt(tick.get('last') / 100);
        if (value <= 7000) {
            this.signalBuy(tick);
        }
        if (value >= 9500) {
            this.signalSell(tick);
        }
    }

    // Buy if we have no active order
    signalBuy(tick) {
        if (this.activeOrder === null) {
            this.activeOrder = this.createOrder(tick, 'buy');
        }
    }

    // Sell if we have an active order
    signalSell(tick) {
        if (this.activeOrder !== null) {
            this.createOrder(tick, 'sell');
            this.activeOrder = null;
        }
    }

    createOrder(tick, type) {
        const order = {
            type,
            timestamp: tick.get('timestamp'),
            price: tick.get('last'),
            quantity: 100,
        };
        this.orders.push(order);
        return order;
    }
}

class Simulation {
    constructor({ ticks, strategy }) {
        this.ticks = ticks;
        this.strategy = strategy;
    }

    run() {
        _.each(this.ticks, (tick) => {
            this.strategy.handleTick(tick);
        });

        this.orders = this.strategy.orders;
    }
}

async function runSimulation(_) {
    const startTick = await db.tick.findAll({
        order: ['timestamp'],
        limit: 1,
    });

    const endTick = await db.tick.findAll({
        order: [['timestamp', 'DESC']],
        limit: 1,
    });

    const ticks = await db.tick.findAll({
        order: ['timestamp'],
    });

    const strategy = new Strategy();
    const simulation = new Simulation({ ticks, strategy });
    simulation.run();

    const sim = {
        from: startTick[0].get('timestamp'),
        to: endTick[0].get('timestamp'),
        orders: simulation.orders,
    }
    return sim;
}

module.exports = runSimulation;
