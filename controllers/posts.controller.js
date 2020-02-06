const postService = require('./../services/post.service');
const imageService = require('./../services/images.service');

const getPosts = async (req, res, next) => {
  try {
    const result = await postService.getPosts(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    const result = await postService.getPostById(postId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const createPost = async (req, res, next) => {
  try {
    // console.log(req.file);
    const image = await imageService.saveImage(req.file.buffer);
    const post = { ...req.body, userId: 1, image };
    const createdId = await postService.createPost(post);
    res.set('Location', `${req.protocol}://${req.get('host')}${req.originalUrl}/${createdId}`);
    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};


module.exports = { getPosts, getPostById, createPost };
