const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const stringFilter = require('../../models/stringFilter.model');

module.exports = (tagsController) => {
  const tagsApi = express.Router({ mergeParams: true });

  tagsApi.get('/', validator.query(stringFilter), tagsController.getTags.bind(tagsController));

  return tagsApi;
};
