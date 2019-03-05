import { createConnection, getConnection, ConnectionOptions } from 'typeorm';

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
