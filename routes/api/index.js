const express = require('express');
const authMiddleware = require('../../middleware/auth.middleware');

const api = express.Router();

api.use('/auth', require('./auth'));
api.use('/Posts', authMiddleware, require('./posts'));
api.use('/Users', authMiddleware, require('./users'));
api.use('/Tags', authMiddleware, require('./tags'));

module.exports = api;
