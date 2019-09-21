import { createConnection, getConnection, ConnectionOptions, getRepository } from 'typeorm';
import Tick from '../models/tick';
import Candle from '../models/candle';
import Order, { OrderType, OrderSide, OrderSummary } from '../market/order';

export async function ensureConnection () {
  try {
    getConnection();
  } catch (e) {
    const config = require(`${process.cwd()}/ormconfig.js`);
    await createConnection({
      ...(config as ConnectionOptions),
    });
  }
}
export const delay = delayTime => new Promise(resolve => setTimeout(resolve, delayTime))


export async function cleanup() {
  const tickRepo = getRepository(Tick);

  return tickRepo.clear();
}

////////////// TICKS ///////////////


let tickIndex = 0;

export async function createAndInsertTick(tickData) {
  const tickRepo = getRepository(Tick);
  const tick = createTick(tickData);

  return tickRepo.save(tick);
}

function createTick(tickData): Tick {
  const data = {
    symbol: 'BTCUSD',
    ask: 100,
    bid: 100,
    last: 100 + tickIndex,
    volume: 1200,
    main_volume: 5000,
    timestamp: new Date(`2019-01-01 15:00:${tickIndex}`),
    ...tickData,
  }

  if (tickData.value) {
    data.last = tickData.value * 100;
  }

  tickIndex += 1;

  const tick = new Tick();
  Object.assign(tick, data);
  return tick;
}

export function createTicks(tickData) {
  return tickData.map(data => createTick(data));
}


////////////// ORDERS ///////////////

let orderIndex = 0;


function createOrder(orderData): Order {
  const type = orderData.type || OrderType.LIMIT;
  const side = orderData.side || OrderSide.BUY;
  const quantity = orderData.quantity || 1;
  const price = orderData.price || 1;
  const date = orderData.date || new Date(`2019-01-01 15:00:${orderIndex}`);

  const order = new Order(type, side, quantity, price);
  order.date = date;
  order.resultPrice = orderData.resultPrice || price;

  return order;
}

export function createOrders(orderData): Order[] {
  return orderData.map(data => createOrder(data));
}

////////////// CANDLES ///////////////

let candleIndex = 0;

function createCandle(candleData): Candle {
  const data = {
    open: 20,
    close: 80,
    low: 10,
    high: 100,
    timespan: '1D',
    datetime: new Date(`2019-01-01 15:00:${candleIndex}`),
    ...candleData
  }
  const candle = new Candle();
  Object.assign(candle, data);
  return candle;
}

export function createCandles(candleData): Candle[] {
  return candleData.map(data => createCandle(data));
}
