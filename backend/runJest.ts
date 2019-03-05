// Jest sucks with typescript so we have to resort to this hack
// https://github.com/kulshekhar/ts-jest/issues/411

// @ts-ignore
import * as jest from 'jest';
import { createConnection } from 'typeorm';

process.env.NODE_ENV = 'test';

// globalSetup
async function init() {
  const config = require(`${process.cwd()}/ormconfig.js`);
  console.log('running globalSetup', config);

  const connection = await createConnection(config);
}

// globalTeardown
async function afterTests() {
}

init()
  .then(jest.run)
  .then(afterTests)
  .catch((e) => console.error(e));
