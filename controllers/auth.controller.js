const authService = require('./../services/auth.service');

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const token = authService.login(email, password);

    res.json({ token });
  } catch (error) {
    if (error.name === 'badEmail' || error.name === 'badPassword') {
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
    const userId = authService.createUser(user);
    res.status(201).json({ userId });
  } catch (error) {
    if (error.name === 'badEmail') {
      error.status = 400;
    }
    next(error);
  }
};

module.exports = { login, register };
