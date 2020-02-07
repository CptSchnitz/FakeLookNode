const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const userSchema = require('./../../models/user.model');
const stringFilter = require('./../../models/stringFilter.model');


const usersApi = express.Router({ mergeParams: true });
const userController = require('./../../controllers/users.controller');

usersApi.get('/', validator.query(stringFilter), userController.getUsers);
usersApi.post('/', validator.body(userSchema), userController.createUser);

usersApi.get('/:userId', userController.getUserById);

module.exports = usersApi;
