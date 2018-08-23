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

module.exports = Simulation;
