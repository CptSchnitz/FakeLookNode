const elastic = require('@elastic/elasticsearch');

module.exports = class ElasticClient {
  constructor(elasticConfig, initFunc) {
    this.client = new elastic.Client(elasticConfig);
    this.initFunc = initFunc;
    this.initElastic();
    this.isReady = false;
  }

  initElastic() {
    this.client.ping().then(() => {
      this.initFunc(this.client).then(() => {
        this.isReady = true;
        console.log('done');
      }).catch(() => {
        process.exit();
      });
    }).catch(() => {
      console.log('elastic not responding to ping');
      setTimeout(() => this.initElastic(), 5000);
    });

  }

  getClient() {
    if (!this.isReady) {
      throw new Error('elastic not ready');
    }
    return this.client;
  }
};
