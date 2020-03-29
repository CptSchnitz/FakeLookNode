const shortid = require('shortid');
const EventEmitter = require('events');
const { errorFactory, errors, isSpecificError } = require('../utils/errorManager');

const formatPost = (post, userId) => {
  const { postCommentJoin, likedBy, ...formattedPost } = { ...post };
  formattedPost.likedByUser = !!likedBy.find((id) => id === userId);
  return formattedPost;
};

module.exports = class PostService extends EventEmitter {
  constructor(postDb, commentsService, imageService, socialService) {
    super();
    this.postDb = postDb;
    this.commentsService = commentsService;
    this.imageService = imageService;
    this.socialService = socialService;
  }

  async getPostById(postId, userId) {
    const post = await this.postDb.getPostById(postId, userId);
    if (post) {
      const formattedPost = formatPost(post, userId);
      formattedPost.comments = await this.commentsService.getCommentsByPostId(postId, userId);
      return formattedPost;
    }
    throw errorFactory(errors.postDoesntExist, 'a post with the specified id ws not found');
  }

  async createPost(post, imageBuffer) {
    const imageUuid = await this.imageService.saveImage(imageBuffer);

    try {
      const postId = `p${shortid.generate()}`;
      const { creatorId, ...postFull } = {
        ...post, publishDate: new Date(), imageUuid, likes: 0, likedBy: [], postId,
      };

      const creator = await this.socialService.getUserById(creatorId);
      postFull.creator = {
        firstName: creator.firstName,
        lastName: creator.lastName,
        userId: creator.userId,
      };

      postFull.userTags = await this.socialService.getUsersByIds(postFull.userTags);

      await this.postDb.createPost(postFull);

      this.emit('newPost', postFull);
      return postId;
    } catch (err) {
      await this.imageService.deleteImages(imageUuid);
      throw err;
    }
  }

  async getPosts(postFilters, userId) {
    const posts = await this.postDb.getPosts(postFilters);

    return posts.map((post) => formatPost(post, userId));
  }


  async addPostLike(postId, userId) {
    try {
      await this.postDb.addPostLike(postId, userId);
      const post = await this.postDb.getPostById(postId);
      this.emit('like', {
        postId,
        count: post.likes,
        action: 'add',
        userId,
      });
    } catch (error) {
      if (isSpecificError(error, errors.docNotFound)) {
        throw errorFactory(errors.postDoesntExist, 'post with the specified Id not found');
      }
      throw error;
    }
  }

  async deletePostLike(postId, userId) {
    try {
      await this.postDb.deletePostLike(postId, userId);
      const post = await this.postDb.getPostById(postId);
      this.emit('like', {
        postId,
        count: post.likes,
        action: 'remove',
        userId,
      });
    } catch (error) {
      if (isSpecificError(error, errors.docNotFound)) {
        throw errorFactory(errors.postDoesntExist, 'post with the specified Id not found');
      }
      throw error;
    }
  }
};
