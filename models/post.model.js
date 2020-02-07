const joi = require('@hapi/joi');

const idSchema = joi.number().positive().integer();

const postSchema = joi.object({
  text: joi.string().allow('').max(500).optional(),
  location: joi.object({
    lng: joi.number().max(180).min(-180).precision(6)
      .required(),
    lat: joi.number().max(90).min(-90).precision(6)
      .required(),
  }).required(),
  tags: joi.array().items(joi.string().min(2).max(50)).unique(),
  userTags: joi.array().items(idSchema).unique(),
});

module.exports = postSchema;
