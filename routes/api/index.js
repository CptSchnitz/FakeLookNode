const express = require('express');

module.exports = (authRoute, postsRoute, usersRoute, tagsRoute, authMiddleware) => {
  const api = express.Router();

  api.use('/auth', authRoute);

  api.use('/Posts', authMiddleware.checkAuth.bind(authMiddleware), postsRoute);
  api.use('/Users', authMiddleware.checkAuth.bind(authMiddleware), usersRoute);
  api.use('/Tags', authMiddleware.checkAuth.bind(authMiddleware), tagsRoute);

  return api;
};
