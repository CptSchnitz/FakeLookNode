const postDb = require('../db/post.db');

const getPostById = async (postId) => postDb.getPostById(postId);

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
    likes: post.Likes,
    location: { lng: post.Lng, lat: post.Lat },
  }));

  return formattedPosts;
};


module.exports = { getPostById, createPost, getPosts };
