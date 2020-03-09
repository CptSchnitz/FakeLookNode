const elastic = require('@elastic/elasticsearch');
const config = require('config');

const elasticConfig = { ...config.get('server.elasticConfig'), parseJSON: true };

const client = new elastic.Client(elasticConfig);

module.exports = { client };
