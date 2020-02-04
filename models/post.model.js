const joi = require('@hapi/joi');

const idSchema = joi.number().positive().integer().required();

const postSchema = joi.object({
  image: joi.string().max(100).required(),
  text: joi.string().max(500),
  lng: joi.number().less(180).greater(-180).precision(5)
    .required(),
  lat: joi.number().less(180).greater(-180).precision(5)
    .required(),
  userId: idSchema,
  tags: joi.array().items(joi.string().max(50).required()),
  userTags: joi.array().items(idSchema),
});

module.exports = postSchema;
