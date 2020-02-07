const userDb = require('./../db/user.db');

const getUsers = async (filter) => userDb.getUsers(filter);
const getUserById = async (userId) => userDb.getUserById(userId);
const createUser = async (user) => userDb.createUser(user);

module.exports = { getUsers, getUserById, createUser };
