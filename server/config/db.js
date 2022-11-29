const { MongoClient } = require('mongodb');

let config = {
    "host":"localhost",
    "port":"27017",
    "db":"ee547_project",
    "opts":{
        "useUnifiedTopology":true
    }
}

// Check for local config files
try {
    let conf = require('./mongo.json');
    config = {...config, ...conf}
}
catch {}

// Create a class to connect with the mongo cluster
class MongoBot {
  constructor() {
    this.mongo_uri = `mongodb://${config.host}:${config.port}`;

    this.client = new MongoClient(this.mongo_uri, config.opts);
  }
  async init() {
    await this.client.connect();
    console.log('Connection to mongodb cluster established!');

    this.db = this.client.db(config.db);
  }
}

module.exports = {mongo_bot: new MongoBot(), mongo_config:config};