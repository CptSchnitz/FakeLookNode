const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const userSchema = require('./../../models/user.model');


const postsApi = express.Router({ mergeParams: true });
const userController = require('./../../controllers/users.controller');

postsApi.get('/', userController.getUsers);
postsApi.post('/', validator.body(userSchema), userController.createUser);

postsApi.get('/:userId', userController.getUserById);

module.exports = postsApi;
