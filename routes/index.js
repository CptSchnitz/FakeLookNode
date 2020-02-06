const express = require('express');

const router = express.Router();

router.use('/api', require('./api'));
router.use('/images', require('./images'));

module.exports = router;
