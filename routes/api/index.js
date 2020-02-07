const express = require('express');

const api = express.Router();

api.use('/Posts', require('./posts'));
api.use('/Users', require('./users'));
api.use('/Tags', require('./tags'));

module.exports = api;
