const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const authController = require('./../../controllers/auth.controller');
const loginSchema = require('../../models/login.model');
const userSchema = require('../../models/login.model');

const authRouter = express.Router();

authRouter.post('/register', validator.body(userSchema), authController.register);
authRouter.post('/login', validator.body(loginSchema), authController.login);

module.exports = authRouter;
