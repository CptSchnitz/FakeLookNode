const shortid = require('shortid');
const commentsDb = require('./../db/comment.db');
const postsDb = require('./../db/post.db');
const socialService = require('./social.service');
const { errorFactory, errors, isSpecificError } = require('../utils/errorManager');

const formatComment = (comment, userId) => {
  const { postCommentJoin, likedBy, ...formattedComment } = { ...comment };
  formattedComment.likedByUser = !!likedBy.find((id) => id === userId);
  return formattedComment;
};

const getCommentsByPostId = async (postId, userId) => {
  const comments = await commentsDb.getCommentsByPostId(postId);

  return comments.map(comment => formatComment(comment, userId));
};


const createComment = async (comment) => {
  if (!(await postsDb.getPostById(comment.postId))) {
    throw errorFactory(errors.postDoesntExist, 'couldnt find post with the specified id.');
  }

  const commentId = `c${shortid.generate()}`;
  const { creatorId, ...commentFull } = {
    ...comment,
    publishDate: new Date(),
    likes: 0,
    likedBy: [],
    commentId,
  };
  const creator = await socialService.getUserById(creatorId);
  commentFull.creator = {
    firstName: creator.firstName,
    lastName: creator.lastName,
    userId: creator.userId,
  };

  commentFull.userTags = await socialService.getUsersByIds(commentFull.userTags);

  await commentsDb.createComment(commentFull);

  commentFull.likedByUser = false;
  return commentFull;
};

const addCommentLike = async (commentId, userId) => {
  try {
    await commentsDb.addCommentLike(commentId, userId);
  } catch (error) {
    if (isSpecificError(error, errors.docNotFound)) {
      throw errorFactory(errors.commentDoesntExist, 'comment with the specified Id not found');
    }
    throw error;
  }
};


const deleteCommentLike = async (commentId, userId) => {
  try {
    await commentsDb.deleteCommentLike(commentId, userId);
  } catch (error) {
    if (isSpecificError(error, errors.docNotFound)) {
      throw errorFactory(errors.commentDoesntExist, 'comment with the specified Id not found');
    }
    throw error;
  }
};

module.exports = {
  getCommentsByPostId, createComment, addCommentLike, deleteCommentLike,
};
