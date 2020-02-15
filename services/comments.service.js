const commentsDb = require('./../db/comment.db');

const getCommentsByPostId = async (postId, userId) => {
  const result = await commentsDb.getCommentsByPostId(postId, userId);

  return result.map((comment) => {
    const newComment = { ...comment };
    newComment.likedByUser = !!newComment.likedByUser;
    if (!newComment.tags) {
      newComment.tags = [];
    }
    if (!newComment.userTags) {
      newComment.userTags = [];
    }
    return newComment;
  });
};

const createComment = async (comment) => {
  const commentWithPublishDate = { ...comment, publishDate: new Date() };

  const commentId = await commentsDb.createComment(commentWithPublishDate);
  return commentsDb.getCommentById(commentId, comment.creatorId);
};

module.exports = { getCommentsByPostId, createComment };
