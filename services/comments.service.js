const shortid = require('shortid');
const commentsDb = require('./../db/comment.db');
const postsDb = require('./../db/post.db');
const socialService = require('./social.service');
const { errorFactory, errors } = require('../utils/errorManager');


// const commentFormatter = (comment) => {
//   const newComment = { ...comment };
//   if (!newComment.tags) {
//     newComment.tags = [];
//   }
//   if (!newComment.userTags) {
//     newComment.userTags = [];
//   }
//   return newComment;
// };


const getCommentsByPostId = async (postId, userId) => {
  const result = await commentsDb.getCommentsByPostId(postId);

  return result;
};


const createComment = async (comment) => {
  if (!(await postsDb.getPostById(comment.postId))) {
    throw errorFactory(errors.postDoesntExist, 'couldnt find post with the specified id.');
  }

  const commentId = shortid.generate();
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

  return commentFull;
};

const addCommentLike = async (commentId, userId) => {
  await commentsDb.addCommentLike(commentId, userId);
};


const deleteCommentLike = async (commentId, userId) => {
  await commentsDb.deleteCommentLike(commentId, userId);
};

module.exports = {
  getCommentsByPostId, createComment, addCommentLike, deleteCommentLike,
};
