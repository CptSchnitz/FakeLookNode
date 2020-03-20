const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const stringFilter = require('../../models/stringFilter.model');

module.exports = (socialController) => {
  const usersApi = express.Router({ mergeParams: true });

  usersApi.get('/', validator.query(stringFilter), socialController.getUsers.bind(socialController));
  usersApi.get('/:userId', socialController.getUserById.bind(socialController));

  return usersApi;
};
