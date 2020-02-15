const { poolPromise } = require('./db');

const getCommentsByPostId = async (postId, userId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('postId', postId)
    .input('likedById', userId)
    .execute('GetCommentsByPostId');

  return result.recordset[0];
};

const createComment = async (comment) => {
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('text', comment.text)
    .input('postId', comment.postId)
    .input('creatorId', comment.creatorId)
    .input('publishDate', comment.publishDate.toISOString().slice(0, -5))
    .input('userTags', JSON.stringify(comment.userTags))
    .input('tags', JSON.stringify(comment.tags))
    .output('commentId')
    .execute('CreateComment');

  return result.output.commentId;
};

const getCommentById = async (commentId, userId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('commentId', commentId)
    .input('likedById', userId)
    .execute('GetCommentById');
  const comment = result.recordset[0][0];
  comment.likedByUser = !!comment.likedByUser;
  return comment;
};

module.exports = { getCommentsByPostId, createComment, getCommentById };
