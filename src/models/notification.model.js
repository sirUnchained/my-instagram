const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    notifCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    notifFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    notifType: {
      type: String,
      default: "like",
      enum: ["like", "follow"],
    },
    body: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

schema.statics.followNotif = async function (follower, following) {
  const newNotif = new model({
    notifCreator: follower._id,
    notifFor: following._id,
    body: `<a href="/profile/${follower.username}">${follower.username}</a> wants to followed you.`,
  });
  await newNotif.save();
};

const model = mongoose.model("notifications", schema);

module.exports = model;
