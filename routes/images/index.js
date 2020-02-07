const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const imageController = require('../../controllers/images.controller');
const requestSchema = require('../../models/imageRequest.model');

const imagesRouter = express.Router();

imagesRouter.get('/:imageUuid', validator.params(requestSchema), imageController.getImage(false));
imagesRouter.get('/thumb/:imageUuid', validator.params(requestSchema), imageController.getImage(true));


module.exports = imagesRouter;
