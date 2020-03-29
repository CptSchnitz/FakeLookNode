const express = require('express');

module.exports = (authRoute, postsRoute, usersRoute, tagsRoute, commentsRoute, authMiddleware) => {
  const api = express.Router({ mergeParams: true });

  api.use('/auth', authRoute);
  api.use('/Posts/:postId/comments', authMiddleware.checkAuth.bind(authMiddleware), commentsRoute);
  api.use('/Posts', authMiddleware.checkAuth.bind(authMiddleware), postsRoute);
  api.use('/Users', authMiddleware.checkAuth.bind(authMiddleware), usersRoute);
  api.use('/Tags', authMiddleware.checkAuth.bind(authMiddleware), tagsRoute);

  return api;
};
