const joi = require('@hapi/joi');

const idSchema = joi.number().positive().integer().required();

const postSchema = joi.object({
  text: joi.string().max(500),
  location: joi.object({
    lng: joi.number().max(90).min(-90).precision(6)
      .required(),
    lat: joi.number().max(180).min(-180).precision(6)
      .required(),
  }).required(),
  userId: idSchema,
  tags: joi.array().items(joi.string().max(50).required()).unique(),
  userTags: joi.array().items(idSchema).unique(),
});

module.exports = postSchema;
