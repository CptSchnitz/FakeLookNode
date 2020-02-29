const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const addMinutes = require('date-fns/addMinutes');
const authDb = require('./../db/auth.db');
const socialService = require('./social.service');
const { errorFactory, errors } = require('../utils/errorManager');

// jwt token expiration time in minutes (mb move to config?)
const expireTime = 30;
const jwtSecret = config.get('server.secret');

const checkIfEmailUsed = async (email) => {
  const user = await authDb.getUserByEmail(email);

  return !!user;
};

const login = async (email, password) => {
  const user = await authDb.getUserByEmail(email);

  if (!user) {
    throw errorFactory(errors.badEmail, 'the email was not found');
  }

  if (!await bcrypt.compare(password, user.passwordHash)) {
    throw errorFactory(errors.badPassword, 'the password is incorrect');
  }
  const idToken = jwt.sign({ userId: user.userId }, jwtSecret, { expiresIn: `${expireTime}m` });

  const userDetails = await socialService.getUserById(user.userId);

  const expiration = addMinutes(new Date(), 30);
  return {
    idToken,
    userId: userDetails.userId,
    firstName: userDetails.firstName,
    lastName: userDetails.lastName,
    expiration,
  };
};

const createUser = async (user) => {
  const { email, password, ...userDetails } = { ...user };

  if (await checkIfEmailUsed(email)) {
    throw errorFactory(errors.badEmail, 'the email is already used');
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


module.exports = { login, createUser, checkIfEmailUsed };
