/* eslint-disable no-underscore-dangle */
const elasticApi = require('./elasticApi');
const { errorFactory, errors } = require('../utils/errorManager');

const getCommentsByPostId = async (postId) => {
  const result = await elasticApi.search({
    query: {
      parent_id: {
        type: 'comment',
        id: postId,
      },
    },
    sort: { publishDate: { order: 'asc' } },
  });
  return result.hits.hits.map((hit) => hit._source);
};

const createComment = async (comment) => {
  const commentWithJoinField = { ...comment, postCommentJoin: { name: 'comment', parent: comment.postId } };

  await elasticApi.index(comment.commentId, commentWithJoinField);
};

const getCommentById = async (commentId) => {
  const result = elasticApi.getById(commentId);

  return result;
};

const addCommentLike = async (commentId, userId) => {
  const succeeded = await elasticApi.addLike(commentId, userId);
  if (!succeeded) {
    throw errorFactory(errors.alreadyLiked, 'Comment already liked by the user');
  }
};

const deleteCommentLike = async (commentId, userId) => {
  const succeeded = await elasticApi.removeLike(commentId, userId);
  if (!succeeded) {
    throw errorFactory(errors.notLiked, 'Post not liked by the user');
  }
};

module.exports = {
  getCommentsByPostId, createComment, getCommentById, addCommentLike, deleteCommentLike,
};
