const tagService = require('./../services/tags.service');


const getTags = async (req, res, next) => {
  try {
    const { filter } = req.query;
    const result = await tagService.getTags(filter);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { getTags };
