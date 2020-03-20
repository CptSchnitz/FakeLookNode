const express = require('express');
const joi = require('@hapi/joi');
const validator = require('express-joi-validation').createValidator({});
const loginSchema = require('../../models/login.model');
const userSchema = require('../../models/user.model');

module.exports = (authController) => {
  const authRouter = express.Router();

  authRouter.post('/register', validator.body(userSchema), authController.register.bind(authController));
  authRouter.post('/login', validator.body(loginSchema), authController.login.bind(authController));
  authRouter.get('/isTaken', validator.query(joi.object({ email: joi.string().email().required() })), authController.isTaken.bind(authController));

  return authRouter;
};
