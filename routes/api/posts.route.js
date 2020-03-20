const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const multer = require('multer');
const postSchema = require('../../models/post.model');
const postFilterSchema = require('../../models/postFilter.model');
const { postIdSchema, commentLikeSchema } = require('../../models/id.model');
const commentSchema = require('../../models/comment.model');

const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = (postController, commentsController, middleware) => {
  const postsApi = express.Router({ mergeParams: true });

  postsApi.get('/', validator.query(postFilterSchema), postController.getPosts.bind(postController));
  postsApi.post('/', upload.single('image'), middleware.parseData, validator.body(postSchema), postController.createPost.bind(postController));
  postsApi.get('/:postId', validator.params(postIdSchema), postController.getPostById.bind(postController));
  postsApi.get('/:postId/comments', validator.params(postIdSchema), validator.body(commentSchema), commentsController.getCommentsByPostId.bind(commentsController));
  postsApi.post('/:postId/comments', validator.params(postIdSchema), commentsController.createComment.bind(commentsController));
  postsApi.post('/:postId/comments/:commentId/like', validator.params(commentLikeSchema), commentsController.addCommentLike.bind(commentsController));
  postsApi.delete('/:postId/comments/:commentId/like', validator.params(commentLikeSchema), commentsController.deleteCommentLike.bind(commentsController));
  postsApi.post('/:postId/like', validator.params(postIdSchema), postController.addPostLike.bind(postController));
  postsApi.delete('/:postId/like', validator.params(postIdSchema), postController.deletePostLike.bind(postController));

  return postsApi;
};
