/* eslint-disable no-underscore-dangle */
const { getClient } = require('./elastic');

const getCommentsByPostId = async (postId) => {
  const client = getClient;

  const response = await client.search({
    index: 'fakelook-posts',
    _source_excludes: 'post_com_join',
    body: {
      query: {
        parent_id: {
          type: 'comment',
          id: postId,
        },
      },
      sort: { publishDate: { order: 'asc' } },
    },
  });

  return response.body.hits.hits.map(hit => hit._source);
};

const createComment = async (comment) => {
  const client = getClient;

  const commentWithJoinField = { ...comment, post_com_join: { name: 'comment', parent: comment.postId } };

  await client.index({
    index: 'fakelook-posts',
    routing: 1,
    body: commentWithJoinField,
  });
};

const getCommentById = async (commentId) => {
  const client = getClient;

  const result = await client.get({
    id: commentId,
    _source_excludes: 'post_com_join',
    index: 'fakelook-posts',
  });

  return result.body._source;
};

const addCommentLike = async (commentId, userId) => {
  const client = getClient;

  const response = await client.update({
    index: 'fakelook-posts',
    id: commentId,
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

const deleteCommentLike = async (commentId, userId) => {
  const client = getClient;

  const response = await client.update({
    index: 'fakelook-posts',
    id: commentId,
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
  getCommentsByPostId, createComment, getCommentById, addCommentLike, deleteCommentLike,
};
