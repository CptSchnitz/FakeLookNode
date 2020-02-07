const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const multer = require('multer');
const postSchema = require('./../../models/post.model');
const { parseData } = require('../../middleware/index');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const postsApi = express.Router({ mergeParams: true });
const postController = require('./../../controllers/posts.controller');

postsApi.get('/', postController.getPosts);
postsApi.post('/', upload.single('image'), parseData, validator.body(postSchema), postController.createPost);
postsApi.get('/:id', postController.getPostById);


module.exports = postsApi;
