const { poolPromise } = require('./db');

const getTags = async (filter) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('filter', filter)
    .execute('GetTags');

  return result.recordset;
};

module.exports = { getTags };
