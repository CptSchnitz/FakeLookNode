const { isSpecificError, errors } = require('../utils/errorManager');

module.exports = class CommentsController {
  constructor(commentsService) {
    this.commentsService = commentsService;
  }

  async getCommentsByPostId(req, res, next) {
    try {
      const postId = req.params;
      const result = await this.commentsService.getCommentsByPostId(postId);
      res.json(result);
    } catch (err) {
      if (isSpecificError(err, errors.postDoesntExist)) {
        err.status = 404;
      }
      next(err);
    }
  }

  async createComment(req, res, next) {
    try {
      const comment = { ...req.body, ...req.params, creatorId: req.user.userId };
      const createdComment = await this.commentsService.createComment(comment);

      res.status(201).send(createdComment);
    } catch (err) {
      if (isSpecificError(err, errors.postDoesntExist)) {
        err.status = 404;
      }
      next(err);
    }
  }

  async addCommentLike(req, res, next) {
    try {
      await this.commentsService.addCommentLike(req.params.commentId, req.user.userId);
      res.sendStatus(204);
    } catch (error) {
      if (isSpecificError(error, errors.commentDoesntExist)) {
        error.status = 404;
      } else if (isSpecificError(error, errors.notLiked)) {
        error.status = 400;
      }
      next(error);
    }
  }

  async deleteCommentLike(req, res, next) {
    try {
      await this.commentsService.deleteCommentLike(req.params.commentId, req.user.userId);
      res.sendStatus(204);
    } catch (error) {
      if (isSpecificError(error, errors.commentDoesntExist)) {
        error.status = 404;
      } else if (isSpecificError(error, errors.notLiked)) {
        error.status = 400;
      }
      next(error);
    }
  }
};
