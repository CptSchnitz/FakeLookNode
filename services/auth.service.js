const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const authDb = require('./../db/auth.db');

const jwtSecret = config.get('server.app.port');

const socialService = require('./social.service');

const errors = {
  badEmail: new Error().name = 'badEmail',
  badPassword: new Error().name = 'badPassword',
};

const checkIfEmailUsed = async (email) => {
  const user = await authDb.getUserByEmail(email);
  return !!user;
};

const login = async (email, password) => {
  const user = await authDb.getUserByEmail(email);
  if (!user) {
    throw errors.badEmail;
  }

  await bcrypt.compare(password, user.passwordHash).catch(() => {
    throw errors.badPassword;
  });

  return jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '30m' });
};

const createUser = async (user) => {
  const { email, password, ...userDetails } = { ...user };
  if (checkIfEmailUsed(email)) {
    throw errors.badEmail;
  }

  const hash = await bcrypt.hash(password, 10);

  userDetails.userId = await authDb.createAuthUser(email, hash);

  try {
    await socialService.createUser(userDetails);
    return userDetails.userId;
  } catch (err) {
    await authDb.deleteAuthUser(userDetails.userId);
    throw err;
  }
};


module.exports = { login, createUser };
