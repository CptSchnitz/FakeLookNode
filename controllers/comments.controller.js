const commentsService = require('./../services/comments.service');

const getCommentsByPostId = async (req, res, next) => {
  try {
    const postId = req.params;
    const result = await commentsService.getCommentsByPostId(postId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const createComment = async (req, res, next) => {
  try {
    const comment = { ...req.body, ...req.params, creatorId: req.user.userId };
    const createdComment = await commentsService.createComment(comment);

    res.json(createdComment);
  } catch (err) {
    if (err.name === 'invalidPostId') {
      err.status = 400;
    }
    next(err);
  }
};

const addCommentLike = async (req, res, next) => {
  try {
    await commentsService.addCommentLike(req.params.commentId, req.user.userId);
    res.sendStatus(204);
  } catch (error) {
    if (error.name === 'badCommentId') {
      error.status = 400;
    }
    next(error);
  }
};

const deleteCommentLike = async (req, res, next) => {
  try {
    await commentsService.deleteCommentLike(req.params.commentId, req.user.userId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommentsByPostId, createComment, addCommentLike, deleteCommentLike,
};
