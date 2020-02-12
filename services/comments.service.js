const commentsDb = require('./../db/comment.db');

const getCommentsByPostId = async (postId) => commentsDb.getCommentsByPostId(postId);

const createComment = async (comment) => {
  const commentWithPublishDate = { ...comment, publishDate: new Date() };

  const commentId = await commentsDb.createComment(commentWithPublishDate);
  return commentsDb.getCommentById(commentId);
};

module.exports = { getCommentsByPostId, createComment };
