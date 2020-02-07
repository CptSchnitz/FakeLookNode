const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const stringFilter = require('./../../models/stringFilter.model');


const tagsApi = express.Router({ mergeParams: true });
const tagsController = require('./../../controllers/tags.controller');

tagsApi.get('/', validator.query(stringFilter), tagsController.getTags);

module.exports = tagsApi;
