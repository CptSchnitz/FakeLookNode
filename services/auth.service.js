const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const addMinutes = require('date-fns/addMinutes');
const authDb = require('./../db/auth.db');
const socialService = require('./social.service');

// jwt token expiration time in minutes (mb move to config?)
const expireTime = 30;
const jwtSecret = config.get('server.secret');


const errors = {
  badEmail: () => {
    const error = new Error();
    error.name = 'badEmail';
    return error;
  },
  badPassword: () => {
    const error = new Error();
    error.name = 'badPassword';
    return error;
  },
};

const checkIfEmailUsed = async (email) => {
  const user = await authDb.getUserByEmail(email);

  return !!user;
};

const login = async (email, password) => {
  const user = await authDb.getUserByEmail(email);
  if (!user) {
    throw errors.badEmail();
  }


  if (!await bcrypt.compare(password, user.passwordHash)) {
    throw errors.badPassword();
  }
  const idToken = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: `${expireTime}m` });

  const userDetails = await socialService.getUserById(user.id);

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
    throw errors.badEmail();
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
