module.exports = class TagsDb {
  constructor(elasticApi) {
    this.elasticApi = elasticApi;
  }

  async getTags(filter) {
    if (filter) {
      const body = {
        suggest: {
          tags: {
            prefix: filter,
            completion: {
              field: 'tags.suggest',
              skip_duplicates: true,
            },
          },
        },
      };

      const response = await this.elasticApi.search(body, 10, { _source_excludes: '*' });
      return response.suggest.tags[0].options.map((res) => res.text);
    }
    const body = {
      aggs: {
        uniqueTags: {
          terms: {
            field: 'tags',
            size: 10,
          },
        },
      },
    };
    const response = await this.elasticApi.search(body, 0);
    return response.aggregations.uniqueTags.buckets.map((res) => res.key);

  }
};
