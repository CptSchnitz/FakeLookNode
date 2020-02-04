const userDb = require('./../db/userDb');

const getUsers = async () => userDb.getUsers();
const getUserById = async (userId) => userDb.getUserById(userId);
const createUser = async (user) => userDb.createUser(user);

module.exports = { getUsers, getUserById, createUser };
