const express = require('express');

const api = express.Router();

api.use('/Posts', require('./posts'));

module.exports = api;
