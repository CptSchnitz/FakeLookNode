const joi = require('@hapi/joi');

const idSchema = joi.string().max(14);

module.exports = idSchema;
