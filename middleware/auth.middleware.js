const pattern = /Bearer .*/;

module.exports = class AuthMiddleware {
  constructor(authService) {
    this.authService = authService;
  }

  checkAuth(req, res, next) {
    if (req.headers && req.headers.authorization && pattern.test(req.headers.authorization)) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        req.user = this.authService.verify(token);
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
  }
};
