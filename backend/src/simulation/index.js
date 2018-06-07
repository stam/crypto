const db = require('../models');
const Strategy = require('../strategy');
const _ = require('lodash');


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

module.exports = Simulation;
