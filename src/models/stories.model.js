const mongoose = require("mongoose");
const { removeFile } = require("./../utils/removeFile");

const schema = new mongoose.Schema({
  media: {
    path: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const model = mongoose.model("stories", schema);

setInterval(() => {
  async function updateStories() {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const stories = await model.find({
      isVisible: true,
      createdAt: {
        $lte: twentyFourHoursAgo,
      },
    });

    const medias = [];
    stories.forEach((story) => {
      medias.push(story.media);
    });
    removeFile(medias);

    await model.deleteMany({
      isVisible: true,
      createdAt: {
        $lte: twentyFourHoursAgo,
      },
    });
  }
  updateStories();
}, 60 * 60 * 1000);

module.exports = model;
