const { errorFactory, errors } = require('../utils/errorManager');

module.exports = class SocialService {
  constructor(socialDb) {
    this.socialDb = socialDb;
  }

  async getUsers(filter) {
    const result = await this.socialDb.getUsers(filter);
    if (result) {
      return result;
    }
    return [];
  }

  async getUserById(userId) {
    const user = await this.socialDb.getUserById(userId);
    if (user) {
      return user;
    }
    throw errorFactory(errors.userNotFound, 'user with the specified id was not found');
  }

  async createUser(user) {
    if (await this.socialDb.getUserById(user.userId)) {
      throw errorFactory(errors.userAlreadyExists, 'cannot create user with this Id as its already exists');
    }
    await this.socialDb.createUser(user);
  }

  async getUsersByIds(userIds) {
    const result = await this.socialDb.getUsersByIds(userIds);
    if (result.length !== userIds.length) {
      throw new Error();
    }
    return result;
  }
};
