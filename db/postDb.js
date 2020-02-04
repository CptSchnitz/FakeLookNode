const { poolPromise, sql } = require('./db');

const getPostById = async (postId) => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('PostId', sql.Int, postId)
    .execute('GetPostById');

  return result.recordset;
};

const getPosts = async (postsFilters) => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('lng', sql.Float, postsFilters.lng)
    .input('lat', sql.Float, postsFilters.lat)
    .input('distance', sql.Float, postsFilters.distance)
    .input('startDate', sql.DateTime, postsFilters.startDate)
    .input('endDate', sql.DateTime, postsFilters.endDate)
    .execute('GetPosts');

  return result.recordset;
};

const createPost = async (post) => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('Image', sql.NVarChar(100), post.image)
    .input('Text', sql.NVarChar(500), post.text)
    .input('Lng', sql.Float, post.lng)
    .input('Lat', sql.Float, post.lat)
    .input('PublishDate', sql.DateTime, post.publishDate)
    .input('UserId', sql.Int, post.userId)
    .input('tags', sql.NVarChar(4000), JSON.stringify(post.tags))
    .input('userTags', sql.NVarChar(4000), JSON.stringify(post.userTags))
    .output('PostId', sql.Int)
    .execute('CreatePost');

  return result.output.PostId;
};

module.exports = { getPostById, createPost, getPosts };
