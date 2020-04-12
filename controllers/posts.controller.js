const { isSpecificError, errors } = require('../utils/errorManager');

const allowedMimes = ['image/jpeg', 'image/png'];

module.exports = class PostController {
  constructor(postService) {
    this.postService = postService;
  }

  async getPosts(req, res, next) {
    try {
      const result = await this.postService.getPosts(req.query, req.user.userId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getPostById(req, res, next) {
    try {
      const result = await this.postService.getPostById(req.params.postId, req.user.userId);
      res.json(result);
    } catch (err) {
      if (isSpecificError(err, errors.postDoesntExist)) {
        err.status = 404;
      }
      next(err);
    }
  }

  async createPost(req, res, next) {
    if (!allowedMimes.includes(req.file.mimetype)) {
      const error = new Error('Unsupported File Type');
      error.status = 400;
      next(error);
    } else {
      try {
        const post = { ...req.body, creatorId: req.user.userId };
        const createdId = await this.postService.createPost(post, req.file.buffer);

        res.set('Location', `${req.protocol}://${req.get('host')}${req.originalUrl}/${createdId}`);
        res.status(201).send({ message: 'created', postId: createdId });
      } catch (err) {
        next(err);
      }
    }
  }

  async addPostLike(req, res, next) {
    try {
      await this.postService.addPostLike(req.params.postId, req.user.userId);
      res.sendStatus(204);
    } catch (error) {
      if (isSpecificError(error, errors.postDoesntExist)) {
        error.status = 404;
      } else if (isSpecificError(error, errors.alreadyLiked)) {
        error.status = 400;
      }
      next(error);
    }
  }

  async deletePostLike(req, res, next) {
    try {
      await this.postService.deletePostLike(req.params.postId, req.user.userId);
      res.sendStatus(204);
    } catch (error) {
      if (isSpecificError(error, errors.postDoesntExist)) {
        error.status = 404;
      } else if (isSpecificError(error, errors.notLiked)) {
        error.status = 400;
      }
      next(error);
    }
  }
};
