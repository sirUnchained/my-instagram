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
    likedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: false,
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
    body: `<a href="/profile/${follower.username}">${follower.username}</a> just followed you !`,
  });
  await newNotif.save();
};

schema.statics.likedNotif = async function (user, page, post) {
  await model.deleteMany({ likedPost: post });

  const newNotif = new model({
    notifCreator: user._id,
    notifFor: page._id,
    likedPost: post._id,
    body: `${user.username} just liked <a href="/search/${post._id}">this</a> post !`,
  });

  await newNotif.save();
};

const model = mongoose.model("notifications", schema);

module.exports = model;
