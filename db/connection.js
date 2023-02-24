const { Pool } = require('pg');
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({                    //to think
  path: `${__dirname}/../.env.${ENV}`,
});

const config =
  ENV === 'production'
    ? {
        connectionString: process.env.DATABASE_URL,
        max: 2,
      }
    : {};

console.log(`the node enviroment is ${ENV}`);

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error('PGDATABASE or DATABASE_URL not set');
}

module.exports = new Pool(config);
