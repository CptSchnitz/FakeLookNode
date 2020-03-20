const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const addMinutes = require('date-fns/addMinutes');

const { errorFactory, errors } = require('../utils/errorManager');

// jwt token expiration time in minutes
const expireTime = 30;

module.exports = class AuthService {
  constructor(authDb, socialService, jwtSecret) {
    this.authDb = authDb;
    this.socialService = socialService;
    this.jwtSecret = jwtSecret;
  }

  async checkIfEmailUsed(email) {
    const user = await this.authDb.getUserByEmail(email);

    return !!user;
  }

  async login(email, password) {
    const user = await this.authDb.getUserByEmail(email);

    if (!user) {
      throw errorFactory(errors.badEmail, 'the email was not found');
    }

    if (!await bcrypt.compare(password, user.passwordHash)) {
      throw errorFactory(errors.badPassword, 'the password is incorrect');
    }
    const idToken = jwt.sign({ userId: user.userId }, this.jwtSecret, { expiresIn: `${expireTime}m` });

    const userDetails = await this.socialService.getUserById(user.userId);

    const expiration = addMinutes(new Date(), expireTime);
    return {
      idToken,
      userId: userDetails.userId,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      expiration,
    };
  }

  async createUser(user) {
    const { email, password, ...userDetails } = { ...user };

    if (await this.checkIfEmailUsed(email)) {
      throw errorFactory(errors.badEmail, 'the email is already used');
    }

    const hash = await bcrypt.hash(password, 10);

    userDetails.userId = await this.authDb.createAuthUser(email, hash);

    try {
      await this.socialService.createUser(userDetails);
      return userDetails.userId;
    } catch (err) {
      await this.authDb.deleteAuthUser(userDetails.userId);
      throw err;
    }
  }
};
