/* eslint-disable no-underscore-dangle */
const { getClient } = require('./elastic');
const { getSearchQuery } = require('./postQueryBuilder');

const getPostById = async (postId) => {
  const client = getClient;

  const result = await client.get({
    id: postId,
    _source_excludes: 'post_com_join',
    index: 'fakelook-posts',
  });

  return result.body._source;
};

const getPosts = async (postFilter) => {
  const client = getClient;

  const response = await client.search({
    index: 'fakelook-posts',
    _source_excludes: 'post_com_join',
    body: getSearchQuery(postFilter),
  });

  return response.body.hits.hits.map(hit => hit._source);
};

const createPost = async (post) => {
  const client = getClient;

  const postWIthJoinField = { ...post, post_com_join: 'post' };

  await client.index({
    index: 'fakelook-posts',
    id: postWIthJoinField.postId,
    body: postWIthJoinField,
  });
};

const addPostLike = async (postId, userId) => {
  const client = getClient;

  const response = await client.update({
    index: 'fakelook-posts',
    id: postId,
    body: {
      script: {
        id: 'add-like',
        params: {
          userId,
        },
      },
    },
  });

  return !!response.body.response === 'noop';
};

const deletePostLike = async (postId, userId) => {
  const client = getClient;

  const response = await client.update({
    index: 'fakelook-posts',
    id: postId,
    body: {
      script: {
        id: 'remove-like',
        params: {
          userId,
        },
      },
    },
  });

  return !!response.body.response === 'noop';
};


module.exports = {
  getPostById, createPost, getPosts, deletePostLike, addPostLike,
};
