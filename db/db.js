const sql = require('mssql');
const winston = require('winston');
const config = require('config');

const dbConfig = { ...config.get('server.dbConfig'), parseJSON: true };

let poolPromise;

const initConnection = () => {
  poolPromise = new sql.ConnectionPool({ ...dbConfig, options: { enableArithAbort: true } })
    .connect()
    .then((pool) => {
      winston.log('info', 'connected to mssql');
      return pool;
    })
    .catch((err) => {
      winston.log('error', 'connection failed', err);
      return new Error('connection failed');
    });
};

const getPoolPromise = () => {
  if (!poolPromise) {
    initConnection();
  }
  return poolPromise;
};

module.exports = {
  sql,
  getPoolPromise,
};
