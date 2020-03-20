const elastic = require('@elastic/elasticsearch');

module.exports = class ElasticClient {
  constructor(elasticConfig) {
    this.client = new elastic.Client(elasticConfig);
  }
};
