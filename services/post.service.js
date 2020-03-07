const shortid = require('shortid');
const postDb = require('../db/post.db');
const commentsService = require('./comments.service');
const imageService = require('./images.service');
const socialService = require('./social.service');
const { errorFactory, errors } = require('../utils/errorManager');

// const doesPostExist = async (postId, userId) => {
//   const post = await postDb.getPostById(postId, userId);
//   return !!post;
// };

const getPostById = async (postId, userId) => {
  const post = await postDb.getPostById(postId, userId);
  if (post) {
    post.comments = await commentsService.getCommentsByPostId(postId);
    return post;
  }
  throw errorFactory(errors.postDoesntExist, 'a post with the specified id ws not found');
};

const createPost = async (post, imageBuffer) => {
  const imageUuid = await imageService.saveImage(imageBuffer);

  try {
    const postId = shortid.generate();
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
    console.log(err);

    await imageService.deleteImages(imageUuid);
    throw err;
  }
};

const getPosts = async (postFilters, userId) => {
  const posts = await postDb.getPosts(postFilters);
  if (posts) {
    return posts;
  }
  return [];
};


const addPostLike = async (postId, userId) => {
  await postDb.addPostLike(postId, userId);
};

const deletePostLike = async (postId, userId) => {
  await postDb.deletePostLike(postId, userId);
};

module.exports = {
  getPostById, createPost, getPosts, addPostLike, deletePostLike,
};
