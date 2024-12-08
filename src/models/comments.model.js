const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comments",
    default: null,
  },
  body: {
    type: String,
    required: true,
  },
});

const model = mongoose.model("comments", schema);

module.exports = model;
