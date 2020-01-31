const sql = require('mssql');
const winston = require('winston');
const config = require('config');

const poolPromise = new sql.ConnectionPool(config.get('server.dbConfig'))
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
