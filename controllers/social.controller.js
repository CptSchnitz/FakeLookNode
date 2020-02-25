const socialService = require('../services/social.service');
const { isSpecificError, errors } = require('../utils/errorManager');

const getUsers = async (req, res, next) => {
  try {
    const { filter } = req.query;
    const result = await socialService.getUsers(filter);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const result = await socialService.getUserById(userId);
    res.json(result);
  } catch (err) {
    if (isSpecificError(err, errors.userNotFound)) {
      err.status = 404;
    }
    next(err);
  }
};

module.exports = { getUsers, getUserById };
