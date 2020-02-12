const joi = require('@hapi/joi');

const idSchema = joi.number().positive().integer();

module.exports = idSchema;
