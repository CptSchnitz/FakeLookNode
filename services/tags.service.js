const tagsDb = require('./../db/tags.db');

const getTags = async (filter) => tagsDb.getTags(filter);

module.exports = { getTags };
