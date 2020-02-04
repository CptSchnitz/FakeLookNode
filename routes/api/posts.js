const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const postSchema = require('./../../models/post.model');

const postsApi = express.Router({ mergeParams: true });
const postController = require('./../../controllers/posts.controller');

postsApi.get('/', postController.getPosts);
postsApi.post('/', validator.body(postSchema), postController.createPost);
postsApi.get('/:id', postController.getPostById);


module.exports = postsApi;
