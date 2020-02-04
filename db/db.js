const sql = require('mssql');
const winston = require('winston');
const config = require('config');

const dbConfig = config.get('server.dbConfig');
const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then((pool) => {
    winston.log('info', 'connected to mssql');
    return pool;
  })
  .catch((err) => winston.log('error', 'connection failed', err));

module.exports = {
  sql,
  poolPromise,
};
