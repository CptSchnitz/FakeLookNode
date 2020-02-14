const socialService = require('../services/social.service');


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
    next(err);
  }
};

// const createUser = async (req, res, next) => {
//   try {
//     const user = { ...req.body };
//     const createdId = await userService.createUser(user);
//     res.set('Location', `${req.protocol}://${req.get('host')}${req.originalUrl}/${createdId}`);
//     res.sendStatus(201);
//   } catch (err) {
//     next(err);
//   }
// };

module.exports = { getUsers, getUserById };
