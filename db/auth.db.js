const { poolPromise } = require('./db');

const getUserByEmail = async (email) => {
  const pool = await poolPromise;

  const result = await pool.request().input('email', email).execute('GetAuthUserByEmail');

  return result.recordset[0];
};

const createAuthUser = async (email, hash) => {
  const pool = await poolPromise;

  const result = await pool.request()
    .input('email', email)
    .input('passwordHash', hash)
    .output('userId')
    .execute('CreateAuthUser');

  return result.output.userId;
};

const deleteAuthUser = async (userId) => {
  const pool = await poolPromise;

  await pool.request().input('authId', userId).execute('DeleteAuthUser');
};

module.exports = { createAuthUser, getUserByEmail, deleteAuthUser };
