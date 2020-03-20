const express = require('express');
const validator = require('express-joi-validation').createValidator({});

const requestSchema = require('../../models/imageRequest.model');

module.exports = (imageController) => {
  const imagesRouter = express.Router();

  imagesRouter.get('/:imageUuid', validator.params(requestSchema), imageController.getImage(false));
  imagesRouter.get('/thumb/:imageUuid', validator.params(requestSchema), imageController.getImage(true));

  return imagesRouter;
};
