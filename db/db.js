const sql = require("mssql");
const config = require("config");

const poolPromise = new sql.ConnectionPool(config.get('server.dbConfig'))
    .connect()
    .then(pool => {
        console.log("connected to mssql");
        return pool;
    })
    .catch(err => console.log("connection failed", err));

module.exports = {
    sql,
    poolPromise
};
