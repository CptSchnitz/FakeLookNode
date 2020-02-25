const commentsDb = require('./../db/comment.db');
const postsDb = require('./../db/post.db');
const { errorFactory, errors } = require('../utils/errorManager');


const commentFormatter = (comment) => {
  const newComment = { ...comment };
  newComment.likedByUser = !!newComment.likedByUser;
  if (!newComment.tags) {
    newComment.tags = [];
  }
  if (!newComment.userTags) {
    newComment.userTags = [];
  }
  return newComment;
};


const getCommentsByPostId = async (postId, userId) => {
  const result = await commentsDb.getCommentsByPostId(postId, userId);

  if (result) {
    return result.map(commentFormatter);
  }
  return [];
};


const createComment = async (comment) => {
  const commentWithPublishDate = { ...comment, publishDate: new Date() };
  if (!(await postsDb.getPostById(comment.postId))) {
    throw errorFactory(errors.postDoesntExist, 'couldnt find post with the specified id.');
  }

  const commentId = await commentsDb.createComment(commentWithPublishDate);

  const newComment = await commentsDb.getCommentById(commentId, comment.creatorId);

  return commentFormatter(newComment);
};

const addCommentLike = async (commentId, userId) => {
  if (!(await commentsDb.getCommentById(commentId))) {
    throw errorFactory(errors.commentDoesntExist, 'Couldnt find the requested comment');
  }
  await commentsDb.addCommentLike(commentId, userId);
};


// add comment doesnt exist
const deleteCommentLike = async (commentId, userId) => {
  if (!(await commentsDb.getCommentById(commentId))) {
    throw errorFactory(errors.commentDoesntExist, 'Couldnt find the requested comment');
  }
  await commentsDb.deleteCommentLike(commentId, userId);
};

module.exports = {
  getCommentsByPostId, createComment, addCommentLike, deleteCommentLike,
};
