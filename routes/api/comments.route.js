const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const { postIdSchema, commentLikeSchema } = require('../../models/id.model');
const commentSchema = require('../../models/comment.model');

module.exports = (commentsController) => {
  const commentsApi = express.Router({ mergeParams: true });

  commentsApi.get('/', validator.params(postIdSchema), validator.body(commentSchema), commentsController.getCommentsByPostId.bind(commentsController));
  commentsApi.post('/', validator.params(postIdSchema), commentsController.createComment.bind(commentsController));
  commentsApi.post('/:commentId/like', validator.params(commentLikeSchema), commentsController.addCommentLike.bind(commentsController));
  commentsApi.delete('/:commentId/like', validator.params(commentLikeSchema), commentsController.deleteCommentLike.bind(commentsController));

  return commentsApi;
};
