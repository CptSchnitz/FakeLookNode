const joi = require('@hapi/joi');

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

module.exports = loginSchema;
