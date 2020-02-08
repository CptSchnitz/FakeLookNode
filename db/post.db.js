const { poolPromise, sql } = require('./db');

const getPostById = async (postId) => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('PostId', sql.Int, postId)
    .execute('GetPostById');

  return result.recordset;
};

const getPosts = async (postFilter) => {
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

  console.log(filter);
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
    .execute('GetPosts');

  return result.recordset;
};

const createPost = async (post) => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('Image', sql.NVarChar(100), post.image)
    .input('Text', sql.NVarChar(500), post.text)
    .input('Lng', sql.Float, post.location.lng)
    .input('Lat', sql.Float, post.location.lat)
    .input('PublishDate', post.publishDate.toISOString().slice(0, -5))
    .input('UserId', sql.Int, post.userId)
    .input('tags', sql.NVarChar(4000), JSON.stringify(post.tags))
    .input('userTags', sql.NVarChar(4000), JSON.stringify(post.userTags))
    .output('PostId', sql.Int)
    .execute('CreatePost');

  return result.output.PostId;
};


module.exports = { getPostById, createPost, getPosts };
