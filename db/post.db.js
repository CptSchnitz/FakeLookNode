const { poolPromise, sql } = require('./db');

const getPostById = async (postId, userId) => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('PostId', sql.Int, postId)
    .input('likedById', userId)
    .execute('GetPostById');

  if (!result.recordset[0]) {
    return null;
  }

  const post = result.recordset[0][0];
  if (!post.tags) {
    post.tags = [];
  }
  if (!post.userTags) {
    post.userTags = [];
  }

  // eslint-disable-next-line prefer-destructuring
  post.creator = post.creator[0];
  return post;
};

const getPosts = async (postFilter, userId) => {
  const pool = await poolPromise;
  const filter = { ...postFilter };

  if (filter.tags) {
    filter.tags = JSON.stringify(filter.tags);
  }

  if (filter.publishers) {
    filter.publishers = JSON.stringify(filter.publishers);
  }

  if (filter.userTags) {
    filter.userTags = JSON.stringify(filter.userTags);
  }

  const result = await pool
    .request()
    .input('lng', sql.Float, filter.lng)
    .input('lat', sql.Float, filter.lat)
    .input('distance', sql.Float, filter.distance)
    .input('startDate', sql.DateTime, filter.minDate)
    .input('endDate', sql.DateTime, filter.maxDate)
    .input('userTags', filter.userTags)
    .input('tags', filter.tags)
    .input('publishers', filter.publishers)
    .input('orderBy', filter.orderBy)
    .input('likedById', userId)
    .execute('GetPosts');

  return result.recordset[0];
};

const createPost = async (post) => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('imageUuid', sql.NVarChar(100), post.imageUuid)
    .input('text', sql.NVarChar(500), post.text)
    .input('lng', sql.Float, post.location.lng)
    .input('lat', sql.Float, post.location.lat)
    .input('publishDate', post.publishDate.toISOString().slice(0, -5))
    .input('creatorId', sql.Int, post.creatorId)
    .input('tags', sql.NVarChar(4000), JSON.stringify(post.tags))
    .input('userTags', sql.NVarChar(4000), JSON.stringify(post.userTags))
    .output('postId', sql.Int)
    .execute('CreatePost');

  return result.output.postId;
};

const addPostLike = async (postId, userId) => {
  const pool = await poolPromise;

  await pool.request().input('postId', postId).input('likedById', userId).execute('AddPostLike');
};

const deletePostLike = async (postId, userId) => {
  const pool = await poolPromise;

  await pool.request().input('postId', postId).input('likedById', userId).execute('DeletePostLike');
};


module.exports = {
  getPostById, createPost, getPosts, deletePostLike, addPostLike,
};
