const { getPoolPromise, sql } = require('./db');

const getUsers = async (filter) => {
  const pool = await getPoolPromise();

  const result = await pool
    .request()
    .input('filter', filter)
    .execute('GetUsers');

  return result.recordset;
};

const getUserById = async (userId) => {
  const pool = await getPoolPromise();

  const result = await pool
    .request()
    .input('userId', sql.Int, userId)
    .execute('GetUserById');

  return result.recordset[0];
};

const createUser = async (user) => {
  const pool = await getPoolPromise();

  await pool.request()
    .input('userId', user.userId)
    .input('firstName', sql.VarChar(50), user.firstName)
    .input('lastName', sql.VarChar(50), user.lastName)
    .input('address', sql.VarChar(200), user.address)
    .input('workPlace', sql.VarChar(100), user.workPlace)
    .input('birthDate', sql.Date, user.birthDate)
    .execute('CreateUser');
};

const getUsersByIds = async (userIds) => {
  const pool = await getPoolPromise();

  const result = await pool.request()
    .input('userIds', JSON.stringify(userIds))
    .execute('GetUsersByIds');

  return result.recordset;
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUsersByIds,
};