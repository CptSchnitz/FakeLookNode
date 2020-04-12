/* eslint-disable no-underscore-dangle */
const { errorFactory, errors } = require('../utils/errorManager');

const indexName = 'fakelook-posts';

module.exports = class ElasticApi {
  constructor(elasticClient) {
    this.elasticClient = elasticClient;
  }

  async index(id, doc) {
    const response = await this.elasticClient.getClient().index({
      id,
      routing: 1,
      index: indexName,
      body: doc,
    });

    if (response.body.result !== 'created') {
      throw errorFactory(errors.docNotFound);
    }
  }

  async search(body, size = 20, options = {}) {
    const response = await this.elasticClient.getClient().search({
      index: indexName,
      size,
      body,
      ...options,
    });
    return response.body;
  }

  async getById(id) {
    const response = await this.elasticClient.getClient().get({
      index: indexName,
      id,
    });
    if (response.body.found) {
      return response.body._source;
    }
    throw new Error();
  }

  async addLike(id, userId) {
    try {
      const response = await this.elasticClient.getClient().update({
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
  }

  async removeLike(id, userId) {
    try {
      const response = await this.elasticClient.getClient().update({
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
  }
};
