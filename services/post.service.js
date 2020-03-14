const shortid = require('shortid');
const postDb = require('../db/post.db');
const commentsService = require('./comments.service');
const imageService = require('./images.service');
const socialService = require('./social.service');
const { errorFactory, errors, isSpecificError } = require('../utils/errorManager');

const formatPost = (post, userId) => {
  const { postCommentJoin, likedBy, ...formattedPost } = { ...post };
  formattedPost.likedByUser = !!likedBy.find((id) => id === userId);
  return formattedPost;
};

const getPostById = async (postId, userId) => {
  const post = await postDb.getPostById(postId, userId);
  if (post) {
    const formattedPost = formatPost(post, userId);
    formattedPost.comments = await commentsService.getCommentsByPostId(postId, userId);
    return formattedPost;
  }
  throw errorFactory(errors.postDoesntExist, 'a post with the specified id ws not found');
};

const createPost = async (post, imageBuffer) => {
  const imageUuid = await imageService.saveImage(imageBuffer);

  try {
    const postId = `p${shortid.generate()}`;
    const { creatorId, ...postFull } = {
      ...post, publishDate: new Date(), imageUuid, likes: 0, likedBy: [], postId,
    };

    const creator = await socialService.getUserById(creatorId);
    postFull.creator = {
      firstName: creator.firstName,
      lastName: creator.lastName,
      userId: creator.userId,
    };

    postFull.userTags = await socialService.getUsersByIds(postFull.userTags);

    await postDb.createPost(postFull);

    return postId;
  } catch (err) {
    await imageService.deleteImages(imageUuid);
    throw err;
  }
};

const getPosts = async (postFilters, userId) => {
  const posts = await postDb.getPosts(postFilters);

  return posts.map((post) => formatPost(post, userId));
};


const addPostLike = async (postId, userId) => {
  try {
    await postDb.addPostLike(postId, userId);
  } catch (error) {
    if (isSpecificError(error, errors.docNotFound)) {
      throw errorFactory(errors.postDoesntExist, 'post with the specified Id not found');
    }
    throw error;
  }
};

const deletePostLike = async (postId, userId) => {
  try {
    await postDb.deletePostLike(postId, userId);
  } catch (error) {
    if (isSpecificError(error, errors.docNotFound)) {
      throw errorFactory(errors.postDoesntExist, 'post with the specified Id not found');
    }
    throw error;
  }
};

module.exports = {
  getPostById, createPost, getPosts, addPostLike, deletePostLike,
};
