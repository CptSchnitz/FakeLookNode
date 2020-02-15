const postDb = require('../db/post.db');
const commentsService = require('./comments.service');

const getPostById = async (postId, userId) => {
  const post = await postDb.getPostById(postId, userId);
  post.comments = await commentsService.getCommentsByPostId(postId, userId);
  return post;
};

const createPost = async (post) => {
  const postWithPublishDate = { ...post, publishDate: new Date() };
  return postDb.createPost(postWithPublishDate);
};

const getPosts = async (postFilters) => {
  const posts = await postDb.getPosts(postFilters);

  const formattedPosts = posts.map((post) => ({
    postId: post.PostId,
    image: post.Image,
    publishDate: post.PublishDate,
    text: post.Text,
    user: {
      id: post.UserId,
      name: post.UserFullName,
    },
    likes: post.PostLikes,
    location: { lng: post.Lng, lat: post.Lat },
  }));

  return formattedPosts;
};


module.exports = { getPostById, createPost, getPosts };
