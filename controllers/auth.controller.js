const authService = require('./../services/auth.service');
const { isSpecificError, errors } = require('../utils/errorManager');


const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const loginData = await authService.login(email, password);

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
};

const register = async (req, res, next) => {
  const user = { ...req.body };

  try {
    const userId = await authService.createUser(user);
    res.status(201).json({ userId });
  } catch (error) {
    if (isSpecificError(error, errors.badEmail)) {
      error.status = 400;
    }
    next(error);
  }
};

const isTaken = async (req, res, next) => {
  const { email } = req.body;
  try {
    const isEmailTaken = await authService.checkIfEmailUsed(email);
    res.status(200).json(isEmailTaken);
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register, isTaken };
