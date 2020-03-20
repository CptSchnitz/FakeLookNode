module.exports = class TagsController {
  constructor(tagService) {
    this.tagService = tagService;
  }

  async getTags(req, res, next) {
    try {
      const { filter } = req.query;
      const result = await this.tagService.getTags(filter);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
};
