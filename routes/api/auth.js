const express = require('express');
const joi = require('@hapi/joi');
const validator = require('express-joi-validation').createValidator({});
const authController = require('./../../controllers/auth.controller');
const loginSchema = require('../../models/login.model');
const userSchema = require('../../models/user.model');

const authRouter = express.Router();

authRouter.post('/register', validator.body(userSchema), authController.register);
authRouter.post('/login', validator.body(loginSchema), authController.login);
authRouter.post('/isTaken', validator.body(joi.object({ email: joi.string().email().required() })), authController.isTaken);

module.exports = authRouter;
