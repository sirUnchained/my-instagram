const mongoose = require("mongoose");
const app = require("./app");
const redis = require("./utils/redis");

const configs = require("./configENV");

async function run() {
  try {
    await mongoose
      .connect(configs.mongoURL)
      .then(() =>
        console.log(`mongodb connected on ${mongoose.connection.host}`)
      )
      .catch((err) => {
        console.log(err);
        process.exit(1);
      });

    const port = configs.port || 4000;
    app.listen(port, () => {
      console.log(`app listen on port ${port}`);
    });
  } catch (error) {
    await mongoose.disconnect();
    await redis.disconnect();
    throw error;
  }
}

run();
