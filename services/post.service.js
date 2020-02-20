const postDb = require('../db/post.db');
const commentsService = require('./comments.service');
const imageService = require('./images.service');

const changeLikedByToBool = (post) => ({ ...post, likedByUser: !!post.likedByUser });

const getPostById = async (postId, userId) => {
  const post = await postDb.getPostById(postId, userId);
  post.comments = await commentsService.getCommentsByPostId(postId, userId);
  return changeLikedByToBool(post);
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

  const formattedPosts = posts.map(changeLikedByToBool);

  return formattedPosts;
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
