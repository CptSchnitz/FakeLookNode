const elasticApi = require('./elasticApi');

const getTags = async (filter) => {
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

  const response = await elasticApi.search(body, 10, { _source_excludes: '*' });

  return response.suggest.tags[0].options.map((res) => res.text);
};

module.exports = { getTags };
