const express = require('express');


module.exports = (apiRoutes, imageRoute) => {
  const router = express.Router();

  router.use('/api', apiRoutes);
  router.use('/images', imageRoute);

  return router;
};
