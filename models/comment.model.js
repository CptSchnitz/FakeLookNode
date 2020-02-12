const joi = require('@hapi/joi');
const idSchema = require('./id.model');

const postSchema = joi.object({
  text: joi.string().allow('').max(500).optional(),
  tags: joi.array().items(joi.string().min(2).max(50)).unique().optional(),
  userTags: joi.array().items(idSchema).unique().optional(),
}).or('text', 'tags', 'userTags');

module.exports = postSchema;
