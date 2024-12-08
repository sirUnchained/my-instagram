const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
});

const schema = new mongoose.Schema(
  {
    medias: [mediaSchema],
    description: {
      type: String,
      required: false,
    },
    hashtags: [String],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("posts", schema);

module.exports = model;
