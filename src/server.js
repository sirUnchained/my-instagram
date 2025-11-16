const mongoose = require("mongoose");
const http = require("http");

const app = require("./app");
const redis = require("./utils/redis");
const configs = require("./configENV");

const getIoConnection = require("./socketIo/getIoConnection");
const setUpIoConnection = require("./socketIo");
const unzip_files = require("./extract.js");

async function run() {
  try {
    // connect to mongodb
    await mongoose
      .connect(configs.mongoURL)
      .then(() =>
        console.log(`mongodb connected on ${mongoose.connection.host}`)
      )
      .catch((err) => {
        console.log(err);
        process.exit(1);
      });

    // config socket io
    const httpServer = http.createServer(app);
    const io = getIoConnection(httpServer);
    await setUpIoConnection(io);

    const port = configs.port || 4000;
    httpServer.listen(port, () => {
      console.log(`app listen on port ${port}`);
    });
  } catch (error) {
    await mongoose.disconnect();
    await redis.disconnect();
    throw error;
  }
}

unzip_files();
run();
