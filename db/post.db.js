/* eslint-disable no-underscore-dangle */
const { getSearchQuery } = require('./postQueryBuilder');
const { errorFactory, errors } = require('../utils/errorManager');

module.exports = class PostDb {
  constructor(elasticApi) {
    this.elasticApi = elasticApi;
  }

  async getPostById(postId) {
    const result = await this.elasticApi.getById(postId);

    return result;
  }

  async getPosts(postFilter) {
    const result = await this.elasticApi.search(getSearchQuery(postFilter));

    return result.hits.hits.map((hit) => hit._source);
  }

  async createPost(post) {
    const postWithJoinField = { ...post, type: 'post', postCommentJoin: 'post' };

    await this.elasticApi.index(
      postWithJoinField.postId,
      postWithJoinField,
    );
  }

  async addPostLike(postId, userId) {
    const succeeded = await this.elasticApi.addLike(postId, userId);
    if (!succeeded) {
      throw errorFactory(errors.alreadyLiked, 'Post already liked by the user');
    }
  }

  async deletePostLike(postId, userId) {
    const succeeded = await this.elasticApi.removeLike(postId, userId);
    if (!succeeded) {
      throw errorFactory(errors.notLiked, 'Post not liked by the user');
    }
  }
};
