const { isSpecificError, errors } = require('../utils/errorManager');

module.exports = class SocialController {
  constructor(socialService) {
    this.socialService = socialService;
  }

  async getUsers(req, res, next) {
    try {
      const { filter } = req.query;
      const result = await this.socialService.getUsers(filter);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req, res, next) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const result = await this.socialService.getUserById(userId);
      res.json(result);
    } catch (err) {
      if (isSpecificError(err, errors.userNotFound)) {
        err.status = 404;
      }
      next(err);
    }
  }
};
