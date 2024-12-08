const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

const chatsSchema = new mongoose.Schema({
  creators: {
    type: String,
    required: true,
    trim: true,
  },
  href: {
    type: String,
    required: true,
    trim: true,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  messages: {
    type: [messageSchema],
    default: [],
  },
});

const ChatModel = mongoose.model("chats", chatsSchema);

module.exports = ChatModel;
