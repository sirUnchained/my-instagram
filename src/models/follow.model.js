const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

const model = mongoose.model("follows", schema);

module.exports = model;
