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

module.exports = Strategy;
