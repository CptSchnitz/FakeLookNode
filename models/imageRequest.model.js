const joi = require('@hapi/joi');

const imageRequestSchema = joi.object({
  imageUuid: joi.string().uuid({ version: ['uuidv4'] }).required(),
});

module.exports = imageRequestSchema;
