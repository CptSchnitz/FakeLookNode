const joi = require('@hapi/joi');

const id = joi.string().max(14);

const postId = id.pattern(/^p.*$/);
const commentId = id.pattern(/^c.*$/);

const postIdSchema = joi.object({ postId });
const commentLikeSchema = joi.object({ postId, commentId });

module.exports = { postIdSchema, commentLikeSchema };
