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
    const result = await postService.getPostById(req.params.postId, req.user.userId);
    result.likedByUser = !!result.likedByUser;
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const createPost = async (req, res, next) => {
  const allowedMimes = ['image/jpeg', 'image/png'];
  if (!allowedMimes.includes(req.file.mimetype)) {
    next(new Error('Unsupported File Type'));
  }
  try {
    const image = await imageService.saveImage(req.file.buffer);

    const post = { ...req.body, userId: req.user.userId, image };
    const createdId = await postService.createPost(post);

    res.set('Location', `${req.protocol}://${req.get('host')}${req.originalUrl}/${createdId}`);
    res.status(201).send({ message: 'created', postId: createdId });
  } catch (err) {
    next(err);
  }
};


module.exports = { getPosts, getPostById, createPost };
