const userService = require('./../services/users.service');


const getUsers = async (req, res, next) => {
  try {
    const result = await userService.getUsers();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const result = await userService.getUserById(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = { ...req.body };
    const createdId = await userService.createUser(user);
    res.set('Location', `${req.protocol}://${req.get('host')}${req.originalUrl}/${createdId}`);
    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

module.exports = { createUser, getUsers, getUserById };
