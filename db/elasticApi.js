/* eslint-disable no-underscore-dangle */
const { client } = require('./elasticClient');
const { errorFactory, errors } = require('../utils/errorManager');

const indexName = 'fakelook-posts';

const index = async (id, doc) => {
  const response = await client.index({
    id,
    routing: 1,
    index: indexName,
    body: doc,
  });

  if (response.body.result !== 'created') {
    throw errorFactory(errors.docNotFound);
  }
};

const search = async (body, size = 20, options = {}) => {
  const response = await client.search({
    index: indexName,
    size,
    body,
    ...options,
  });
  return response.body;
};

const getById = async (id) => {
  const response = await client.get({
    index: indexName,
    id,
  });
  if (response.body.found) {
    return response.body._source;
  }
  throw new Error();
};

const addLike = async (id, userId) => {
  try {
    const response = await client.update({
      index: indexName,
      id,
      body: {
        script: {
          id: 'add-like',
          params: {
            userId,
          },
        },
      },
    });
    return !(response.body.response === 'noop');
  } catch (error) {
    if (error.name === 'ResponseError' && error.meta.statusCode === 404) {
      throw errorFactory(errors.docNotFound);
    }
    throw error;
  }
};

const removeLike = async (id, userId) => {
  try {
    const response = await client.update({
      index: indexName,
      id,
      body: {
        script: {
          id: 'remove-like',
          params: {
            userId,
          },
        },
      },
    });
    return !(response.body.response === 'noop');
  } catch (error) {
    if (error.name === 'ResponseError' && error.meta.statusCode === 404) {
      throw errorFactory(errors.docNotFound);
    }
    throw error;
  }
};

module.exports = {
  removeLike, addLike, index, getById, search,
};
