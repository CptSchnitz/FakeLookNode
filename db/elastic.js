const elastic = require('@elastic/elasticsearch');
const winston = require('winston');
const config = require('config');

const elasticConfig = { ...config.get('server.elasticConfig'), parseJSON: true };

let client;

// const getClient = () => {
//   if (!client) {
//     client = new elastic.Client(elasticConfig);
//   }
//   return client;
// };

const getClient = new elastic.Client(elasticConfig);

module.exports = { getClient };
