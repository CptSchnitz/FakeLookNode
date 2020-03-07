const socialDb = require('../db/social.db');
const { errorFactory, errors } = require('../utils/errorManager');

const getUsers = async (filter) => {
  const result = await socialDb.getUsers(filter);
  if (result) {
    return result;
  }
  return [];
};

// user not found
const getUserById = async (userId) => {
  const user = await socialDb.getUserById(userId);
  if (user) {
    return user;
  }
  throw errorFactory(errors.userNotFound, 'user with the specified id was not found');
};

const createUser = async (user) => {
  if (await socialDb.getUserById(user.userId)) {
    throw errorFactory(errors.userAlreadyExists, 'cannot create user with this Id as its already exists');
  }
  await socialDb.createUser(user);
};

const getUsersByIds = async (userIds) => {
  const result = await socialDb.getUsersByIds(userIds);
  if (result.length !== userIds.length) {
    throw new Error();
  }
  return result;
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  getUsersByIds,
};
