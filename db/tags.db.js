const { getPoolPromise } = require('./db');

const getTags = async (filter) => {
  const pool = await getPoolPromise();
  const result = await pool
    .request()
    .input('filter', filter)
    .execute('GetTags');

  return result.recordset;
};

module.exports = { getTags };
