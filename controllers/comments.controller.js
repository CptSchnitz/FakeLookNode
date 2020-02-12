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
    const comment = { ...req.body, ...req.params, creatorId: 1 };
    const createdComment = await commentsService.createComment(comment);

    res.json(createdComment);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCommentsByPostId, createComment };
