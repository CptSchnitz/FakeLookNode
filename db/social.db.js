const { poolPromise, sql } = require('./db');

const getUsers = async (filter) => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('filter', filter)
    .execute('GetUsers');

  return result.recordset;
};

const getUserById = async (userId) => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('UserId', sql.Int, userId)
    .execute('GetUserById');

  return result.recordset;
};

const createUser = async (user) => {
  const pool = await poolPromise;

  await pool.request()
    .input('userId', user.userId)
    .input('FirstName', sql.VarChar(50), user.firstName)
    .input('LastName', sql.VarChar(50), user.lastName)
    .input('Address', sql.VarChar(200), user.address)
    .input('WorkPlace', sql.VarChar(100), user.workPlace)
    .input('BirthDate', sql.Date, user.birthDate)
    .execute('CreateUser');
};

module.exports = { createUser, getUsers, getUserById };
