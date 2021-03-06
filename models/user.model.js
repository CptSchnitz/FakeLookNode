const joi = require('@hapi/joi');

const userSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).max(30).required(),
  firstName: joi.string().max(50).required(),
  lastName: joi.string().max(50).required(),
  address: joi.string().max(200).required(),
  workPlace: joi.string().max(100).required(),
  birthDate: joi.date().iso().max('now').required(),
});

module.exports = userSchema;
