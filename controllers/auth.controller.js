const { isSpecificError, errors } = require('../utils/errorManager');


module.exports = class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  async login(req, res, next) {
    const { email, password } = req.body;

    try {
      const loginData = await this.authService.login(email, password);

      res.json(loginData);
    } catch (error) {
      if (isSpecificError(error, errors.badEmail) || isSpecificError(error, errors.badPassword)) {
        const err = new Error('Bad email or password.');
        err.status = 401;
        next(err);
      } else {
        next(error);
      }
    }
  }

  async register(req, res, next) {
    const user = { ...req.body };

    try {
      const userId = await this.authService.createUser(user);
      res.status(201).json({ userId });
    } catch (error) {
      if (isSpecificError(error, errors.badEmail)) {
        error.status = 400;
      }
      next(error);
    }
  }

  async isTaken(req, res, next) {
    const { email } = req.query;
    try {
      const isEmailTaken = await this.authService.checkIfEmailUsed(email);
      res.json(isEmailTaken);
    } catch (error) {
      next(error);
    }
  }
};
