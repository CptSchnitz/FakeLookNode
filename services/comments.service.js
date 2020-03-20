const shortid = require('shortid');
const { errorFactory, errors, isSpecificError } = require('../utils/errorManager');

const formatComment = (comment, userId) => {
  const { postCommentJoin, likedBy, ...formattedComment } = { ...comment };
  formattedComment.likedByUser = !!likedBy.find((id) => id === userId);
  return formattedComment;
};

module.exports = class CommentsService {
  constructor(commentsDb, postDb, socialService) {
    this.commentsDb = commentsDb;
    this.postDb = postDb;
    this.socialService = socialService;
  }

  async getCommentsByPostId(postId, userId) {
    if (!(await this.postDb.getPostById(postId))) {
      throw errorFactory(errors.postDoesntExist, 'couldnt find post with the specified id.');
    }
    const comments = await this.commentsDb.getCommentsByPostId(postId);

    return comments.map((comment) => formatComment(comment, userId));
  }

  async createComment(comment) {
    if (!(await this.postDb.getPostById(comment.postId))) {
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
    const creator = await this.socialService.getUserById(creatorId);
    commentFull.creator = {
      firstName: creator.firstName,
      lastName: creator.lastName,
      userId: creator.userId,
    };

    commentFull.userTags = await this.socialService.getUsersByIds(commentFull.userTags);

    await this.commentsDb.createComment(commentFull);

    commentFull.likedByUser = false;
    return commentFull;
  }

  async addCommentLike(commentId, userId) {
    try {
      await this.commentsDb.addCommentLike(commentId, userId);
    } catch (error) {
      if (isSpecificError(error, errors.docNotFound)) {
        throw errorFactory(errors.commentDoesntExist, 'comment with the specified Id not found');
      }
      throw error;
    }
  }


  async deleteCommentLike(commentId, userId) {
    try {
      await this.commentsDb.deleteCommentLike(commentId, userId);
    } catch (error) {
      if (isSpecificError(error, errors.docNotFound)) {
        throw errorFactory(errors.commentDoesntExist, 'comment with the specified Id not found');
      }
      throw error;
    }
  }
};
