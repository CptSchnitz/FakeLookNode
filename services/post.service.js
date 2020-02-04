const postDb = require('./../db/postDb');

const getPostById = async (postId) => postDb.getPostById(postId);

const createPost = async (post) => {
  const postWithPublishDate = { ...post, publishDate: new Date() };
  return postDb.createPost(postWithPublishDate);
};

const getPosts = async (postFilters) => postDb.getPosts(postFilters);


module.exports = { getPostById, createPost, getPosts };
