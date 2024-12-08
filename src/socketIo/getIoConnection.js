const { Server } = require("socket.io");

function getIoConnection(httpServer) {
  const io = new Server(httpServer, {
    origin: "*",
  });
  return io;
}

module.exports = getIoConnection;
