const mongoose = require("mongoose");
const Crypto = require("crypto");

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expire: {
    type: Date,
    required: true,
  },
});

schema.statics.createRefreshToken = async function (userID) {
  if (!userID) {
    throw new Error("check auth controller line 69");
  }

  const expireTime = Date.now() + 30 * 24 * 60 * 60 * 1000;
  const refreshToken = Crypto.randomUUID();

  const newRefreshToken = new model({
    user: userID,
    token: refreshToken,
    expire: expireTime,
  });

  await newRefreshToken.save();
  return refreshToken;
};

schema.statics.verifyRefreshToken = async function (token) {
  const refreshToken = await model.findOne({ token });

  if (refreshToken && refreshToken.expire > Date.now()) {
    return refreshToken.user;
  } else {
    return null;
  }
};

const model = mongoose.model("refreshTokens", schema);

module.exports = model;
