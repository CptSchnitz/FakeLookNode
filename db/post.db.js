/* eslint-disable no-underscore-dangle */
const elasticApi = require('./elasticApi');
const { getSearchQuery } = require('./postQueryBuilder');
const { errorFactory, errors } = require('../utils/errorManager');

const getPostById = async (postId) => {
  const result = await elasticApi.getById(postId);

  return result;
};

const getPosts = async (postFilter) => {
  const result = await elasticApi.search(getSearchQuery(postFilter));

  return result.hits.hits.map((hit) => hit._source);
};

const createPost = async (post) => {
  const postWithJoinField = { ...post, type: 'post', postCommentJoin: 'post' };

  await elasticApi.index(
    postWithJoinField.postId,
    postWithJoinField,
  );
};

const addPostLike = async (postId, userId) => {
  const succeeded = await elasticApi.addLike(postId, userId);
  if (!succeeded) {
    throw errorFactory(errors.alreadyLiked, 'Post already liked by the user');
  }
};

const deletePostLike = async (postId, userId) => {
  const succeeded = await elasticApi.removeLike(postId, userId);
  if (!succeeded) {
    throw errorFactory(errors.notLiked, 'Post not liked by the user');
  }
};


module.exports = {
  getPostById, createPost, getPosts, deletePostLike, addPostLike,
};
