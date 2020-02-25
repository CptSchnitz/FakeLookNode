const postDb = require('../db/post.db');
const commentsService = require('./comments.service');
const imageService = require('./images.service');
const { errorFactory, errors } = require('../utils/errorManager');

const doesPostExist = async (postId, userId) => {
  const post = await postDb.getPostById(postId, userId);
  return !!post;
};

const changeLikedByToBool = (post) => ({ ...post, likedByUser: !!post.likedByUser });

const getPostById = async (postId, userId) => {
  const post = await postDb.getPostById(postId, userId);
  if (post) {
    post.comments = await commentsService.getCommentsByPostId(postId, userId);
    return changeLikedByToBool(post);
  }
  throw errorFactory(errors.postDoesntExist, 'a post with the specified id ws not found');
};

const createPost = async (post, imageBuffer) => {
  const imageUuid = await imageService.saveImage(imageBuffer);

  try {
    const postWithPublishDate = { ...post, publishDate: new Date(), imageUuid };
    return postDb.createPost(postWithPublishDate);
  } catch (err) {
    await imageService.deleteImages(imageUuid);
    throw err;
  }
};

const getPosts = async (postFilters, userId) => {
  const posts = await postDb.getPosts(postFilters, userId);
  if (posts) {
    const formattedPosts = posts.map(changeLikedByToBool);
    return formattedPosts;
  }
  return [];
};


const addPostLike = async (postId, userId) => {
  if (!doesPostExist(postId, userId)) {
    throw errorFactory(errors.postDoesntExist, 'the post to like doesnt exist');
  }
  await postDb.addPostLike(postId, userId);
};

const deletePostLike = async (postId, userId) => {
  if (!doesPostExist(postId, userId)) {
    throw errorFactory(errors.postDoesntExist, 'the post to like doesnt exist');
  }
  await postDb.deletePostLike(postId, userId);
};

module.exports = {
  getPostById, createPost, getPosts, addPostLike, deletePostLike,
};
