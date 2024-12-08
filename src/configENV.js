require("dotenv").config();

const configs = {
  mongoURL: process.env.MONGO_URI,
  baseURL: process.env.BASE_URL,
  accessTokenSecretKey: process.env.SECRET_TOKEN_ACCESS_KEY,

  port: process.env.PORT,

  redisURI: process.env.REDIS_URI,

  bucketFullURL: process.env.BUCKET_FULL_URL,
  bucketEndPoint: process.env.BUCKET_ENDPOINT,
  bucketName: process.env.BUCKET_NAME,
  bucketAccessKey: process.env.BUCKET_ACCESS_KEY,
  bucketSecretKey: process.env.BUCKET_SECRET_KEY,
};

module.exports = configs;
