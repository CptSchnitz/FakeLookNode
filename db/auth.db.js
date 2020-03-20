module.exports = class AuthDb {
  constructor(sqlConnection) {
    this.sqlConnection = sqlConnection;
  }

  async getUserByEmail(email) {
    const pool = this.sqlConnection.getPool();

    const result = await pool.request().input('email', email).execute('GetAuthUserByEmail');

    return result.recordset[0];
  }

  async createAuthUser(email, hash) {
    const pool = this.sqlConnection.getPool();

    const result = await pool.request()
      .input('email', email)
      .input('passwordHash', hash)
      .output('userId')
      .execute('CreateAuthUser');

    return result.output.userId;
  }

  async deleteAuthUser(userId) {
    const pool = this.sqlConnection.getPool();

    await pool.request().input('authId', userId).execute('DeleteAuthUser');
  }
};
