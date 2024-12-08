const Redis = require("ioredis");
const configs = require("./../configENV");

const redis = new Redis(configs.redisURI);

module.exports = redis;
