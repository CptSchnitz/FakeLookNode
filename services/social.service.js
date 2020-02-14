const socialDb = require('../db/social.db');

const getUsers = async (filter) => socialDb.getUsers(filter);
const getUserById = async (userId) => socialDb.getUserById(userId);
const createUser = async (user) => socialDb.createUser(user);

module.exports = { getUsers, getUserById, createUser };
