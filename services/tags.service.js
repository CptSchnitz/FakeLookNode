module.exports = class TagsService {
  constructor(tagsDb) {
    this.tagsDb = tagsDb;
  }

  async getTags(filter) {
    return this.tagsDb.getTags(filter);
  }
};
