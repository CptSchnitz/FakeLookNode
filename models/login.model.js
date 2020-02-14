const joi = require('@hapi/joi');

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).max(30).required(),
});

module.exports = loginSchema;
