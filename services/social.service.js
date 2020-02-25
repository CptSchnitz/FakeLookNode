const socialDb = require('../db/social.db');
const { errorFactory, errors } = require('../utils/errorManager');

const getUsers = async (filter) => socialDb.getUsers(filter);

// user not found
const getUserById = async (userId) => {
  const user = socialDb.getUserById(userId);
  if (user) {
    return user;
  }
  throw errorFactory(errors.userNotFound, 'user with the specified id was not found');
};
const createUser = async (user) => socialDb.createUser(user);

module.exports = { getUsers, getUserById, createUser };
