const sql = require('mssql');
const winston = require('winston');

module.exports = class SqlConnection {
  constructor(dbConfig) {
    this.dbConfig = dbConfig;
    this.initConnection();
  }

  initConnection() {
    new sql.ConnectionPool({
      ...this.dbConfig,
      options: { enableArithAbort: true },
    })
      .connect()
      .then((pool) => {
        winston.log('info', 'connected to mssql');
        this.pool = pool;
      })
      .catch((err) => {
        winston.log('error', 'connection failed', err);
        setTimeout(() => this.initConnection(), 5000);
      });
  }

  getPool() {
    if (!this.pool) {
      throw new Error('Db not connected yet');
    }
    return this.pool;
  }
};
