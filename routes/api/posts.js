const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const multer = require('multer');
const postSchema = require('./../../models/post.model');
const { parseData } = require('../../middleware/index');
const postFilterSchema = require('./../../models/postFilter.model');
const { postIdSchema, commentLikeSchema } = require('./../../models/id.model');
const commentSchema = require('./../../models/comment.model');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const postsApi = express.Router({ mergeParams: true });
const postController = require('./../../controllers/posts.controller');
const commentsController = require('./../../controllers/comments.controller');

postsApi.get('/', validator.query(postFilterSchema), postController.getPosts);
postsApi.post('/', upload.single('image'), parseData, validator.body(postSchema), postController.createPost);
postsApi.get('/:postId', validator.params(postIdSchema), postController.getPostById);
postsApi.get('/:postId/comments', validator.params(postIdSchema), validator.body(commentSchema), commentsController.getCommentsByPostId);
postsApi.post('/:postId/comments', validator.params(postIdSchema), commentsController.createComment);
postsApi.post('/:postId/comments/:commentId/like', validator.params(commentLikeSchema), commentsController.addCommentLike);
postsApi.delete('/:postId/comments/:commentId/like', validator.params(commentLikeSchema), commentsController.deleteCommentLike);
postsApi.post('/:postId/like', validator.params(postIdSchema), postController.addPostLike);
postsApi.delete('/:postId/like', validator.params(postIdSchema), postController.deletePostLike);


module.exports = postsApi;
