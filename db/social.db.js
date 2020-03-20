module.exports = class SocialDb {
  constructor(sqlConnection) {
    this.sqlConnection = sqlConnection;
  }

  async getUsers(filter) {
    const pool = this.sqlConnection.getPool();

    const result = await pool
      .request()
      .input('filter', filter)
      .execute('GetUsers');

    return result.recordset;
  }

  async getUserById(userId) {
    const pool = this.sqlConnection.getPool();

    const result = await pool
      .request()
      .input('userId', userId)
      .execute('GetUserById');

    return result.recordset[0];
  }

  async createUser(user) {
    const pool = this.sqlConnection.getPool();

    await pool.request()
      .input('userId', user.userId)
      .input('firstName', user.firstName)
      .input('lastName', user.lastName)
      .input('address', user.address)
      .input('workPlace', user.workPlace)
      .input('birthDate', user.birthDate)
      .execute('CreateUser');
  }

  async getUsersByIds(userIds) {
    const pool = this.sqlConnection.getPool();

    const result = await pool.request()
      .input('userIds', JSON.stringify(userIds))
      .execute('GetUsersByIds');

    return result.recordset;
  }
};
