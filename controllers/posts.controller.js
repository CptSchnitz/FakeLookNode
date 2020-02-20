const postService = require('./../services/post.service');

const allowedMimes = ['image/jpeg', 'image/png'];

const getPosts = async (req, res, next) => {
  try {
    const result = await postService.getPosts(req.query, req.user.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const result = await postService.getPostById(req.params.postId, req.user.userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const createPost = async (req, res, next) => {
  if (!allowedMimes.includes(req.file.mimetype)) {
    const error = new Error('Unsupported File Type');
    error.status = 400;
    next(error);
  }
  try {
    const post = { ...req.body, creatorId: req.user.userId };
    const createdId = await postService.createPost(post, req.file.buffer);

    res.set('Location', `${req.protocol}://${req.get('host')}${req.originalUrl}/${createdId}`);
    res.status(201).send({ message: 'created', postId: createdId });
  } catch (err) {
    next(err);
  }
};

const addPostLike = async (req, res, next) => {
  try {
    await postService.addPostLike(req.params.postId, req.user.userId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const deletePostLike = async (req, res, next) => {
  try {
    await postService.deletePostLike(req.params.postId, req.user.userId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getPosts, getPostById, createPost, addPostLike, deletePostLike,
};
