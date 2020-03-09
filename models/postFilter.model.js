const joi = require('@hapi/joi');

const idSchema = joi.number().positive().integer();

const postFilterSchema = joi.object({
  publishers: joi.array().items(idSchema).unique(),
  tags: joi.array().items(joi.string().min(2).max(50)).unique(),
  userTags: joi.array().items(idSchema).unique(),
  distance: joi.number().positive().max(20017462),
  lat: joi.number().max(90).min(-90).precision(6),
  lon: joi.number().max(180).min(-180).precision(6),
  minDate: joi.date().iso().when('maxDate', { is: joi.exist(), then: joi.date().less(joi.ref('maxDate')) }),
  maxDate: joi.date().iso(),
  orderBy: joi.string().valid('likes', 'date'),
}).and('lat', 'lon', 'distance');
module.exports = postFilterSchema;
