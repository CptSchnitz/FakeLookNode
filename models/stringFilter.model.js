const joi = require('@hapi/joi');

const filterSchema = joi.object({
  filter: joi.string().min(2).optional(),
});

module.exports = filterSchema;
