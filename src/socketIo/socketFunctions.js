const ChatModel = require("./../models/chat.model");
const UserModel = require("./../models/user.model");
const jwt = require("jsonwebtoken");
const configs = require("./../configENV");

// const chatChangeStream = ChatModel.watch();

exports.initConnection = (io) => {
  io.on("connection", async (socket) => {
    try {
      const token = socket.handshake.headers.authorization;

      const payload = jwt.verify(token, configs.accessTokenSecretKey);
      if (!payload) {
        socket.emit("error", "no user with you'r username found => 404");
        return socket.disconnect(true);
      }

      const chats = await ChatModel.find(
        {
          creators: {
            $regex: payload.username,
            $options: "i",
          },
        },
        "-messages"
      ).sort({ _id: -1 });

      socket.emit("chats", chats);
    } catch (error) {
      console.log(error);
      socket.emit("error", "you have to login first !");
    }
  });
};

exports.getChats = async (io) => {
  const chats = await ChatModel.find({}).lean();

  io.of("/chat").on("connection", async (socket) => {
    const chatHref = socket.handshake.auth.chatHref;
    let currentChat = await ChatModel.findOne({ href: chatHref });

    getSendCreateSingleMsg(io, socket);
    removeMsg(io, socket);

    socket.on("joining", async (newChat) => {
      currentChat = await ChatModel.findOne({
        _id: currentChat._id,
      }).populate({
        path: "messages.sender",
        model: "users",
      });

      // user must stay in one room not more than one
      const lastChats = Array.from(socket.rooms)[2];
      if (lastChats) {
        socket.leave(lastChats);
      }

      socket.join(newChat);
    });
  });

  /*   chats.forEach((chat) => {
    io.of(chat.href).on("connection", async (socket) => {
      let currentChat = await ChatModel.findById(chat._id);

      getSendCreateSingleMsg(io, socket);
      removeMsg(io, socket);

      socket.on("joining", async (newChat) => {
        currentChat = await ChatModel.findOne({
          _id: chat._id,
        }).populate({
          path: "messages.sender",
          model: "users",
        });

        // user must stay in one room not more than one
        const lastChats = Array.from(socket.rooms)[2];
        if (lastChats) {
          socket.leave(lastChats);
        }

        socket.join(newChat);
      });
    });
  }); */
};

function getSendCreateSingleMsg(io, socket) {
  socket.on("newMsg", async (data) => {
    const { body, sender, href } = data;

    const chat = await ChatModel.findOneAndUpdate(
      { href, isBlocked: false },
      {
        $push: {
          messages: {
            body,
            sender,
          },
        },
      }
    );
    if (!chat.isBlocked) {
      const senderOfMsg = await UserModel.findById(sender);

      io.of("/chat").in(href).emit("sendMsg", {
        body,
        sender: senderOfMsg,
        href,
      });
    }
  });
}

function removeMsg(io, socket) {
  socket.on("removeMsg", async (data) => {
    try {
      const token = data.token;
      const payload = jwt.verify(token, configs.accessTokenSecretKey);
      if (!payload) {
        socket.emit("error", "you are not athorized ! login first.");
        // return socket.disconnect(true);
      }

      const chatHref = Array.from(socket.rooms)[1];
      const currentChats = await ChatModel.findOne({
        href: chatHref,
      });
      if (!currentChats) {
        return socket.emit("error", "chat not found.");
      }

      const removingIndes = currentChats.messages.findIndex((msg) => {
        return msg._id.toString() === data.msgID.toString();
      });
      if (
        payload._id.toString() ===
        currentChats.messages[removingIndes]?.sender.toString()
      ) {
        currentChats.messages.splice(removingIndes, 1);
        await currentChats.save();
      }
    } catch (error) {
      console.log(error);
      return socket.emit("error", error.message);
    }
  });
}
