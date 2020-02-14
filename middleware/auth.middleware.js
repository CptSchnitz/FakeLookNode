const jwt = require('jsonwebtoken');
const config = require('config');

const jwtSecret = config.get('server.app.port');

const checkAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    try {
      req.user = await jwt.verify(req.headers.authorization, jwtSecret);
    } catch (error) {
      const err = new Error('Failed to authenticate.');
      err.status = 401;
      next(err);
    }
  } else {
    const err = new Error('Failed to authenticate.');
    err.status = 401;
    next(err);
  }
  next();
};

module.exports = checkAuth;
