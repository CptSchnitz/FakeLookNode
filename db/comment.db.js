/* eslint-disable no-underscore-dangle */
const { errorFactory, errors } = require('../utils/errorManager');

module.exports = class CommentDb {
  constructor(elasticApi) {
    this.elasticApi = elasticApi;
  }

  async getCommentsByPostId(postId) {
    const result = await this.elasticApi.search({
      query: {
        parent_id: {
          type: 'comment',
          id: postId,
        },
      },
      sort: { publishDate: { order: 'asc' } },
    });
    return result.hits.hits.map((hit) => hit._source);
  }

  async createComment(comment) {
    const commentWithJoinField = { ...comment, type: 'comment', postCommentJoin: { name: 'comment', parent: comment.postId } };

    await this.elasticApi.index(comment.commentId, commentWithJoinField);
  }

  async getCommentById(commentId) {
    const result = this.elasticApi.getById(commentId);

    return result;
  }

  async addCommentLike(commentId, userId) {
    const succeeded = await this.elasticApi.addLike(commentId, userId);
    if (!succeeded) {
      throw errorFactory(errors.alreadyLiked, 'Comment already liked by the user');
    }
  }

  async deleteCommentLike(commentId, userId) {
    const succeeded = await this.elasticApi.removeLike(commentId, userId);
    if (!succeeded) {
      throw errorFactory(errors.notLiked, 'Post not liked by the user');
    }
  }
};
