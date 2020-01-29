const express = require('express')
const router = express.Router()


router.use('/Posts', (req, res) => res.send("lol"));

module.exports = router