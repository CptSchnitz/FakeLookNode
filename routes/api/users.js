const express = require('express');
const validator = require('express-joi-validation').createValidator({});
// const userSchema = require('./../../models/user.model');
const stringFilter = require('./../../models/stringFilter.model');


const usersApi = express.Router({ mergeParams: true });
const socialController = require('../../controllers/social.controller');

usersApi.get('/', validator.query(stringFilter), socialController.getUsers);
// usersApi.post('/', validator.body(userSchema), userController.createUser);

usersApi.get('/:userId', socialController.getUserById);

module.exports = usersApi;
