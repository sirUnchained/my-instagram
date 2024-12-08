const { initConnection, getChats } = require("./socketFunctions");

async function setUpIoConnection(io) {
  initConnection(io);
  await getChats(io);
}

module.exports = setUpIoConnection;
