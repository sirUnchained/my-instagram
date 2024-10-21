const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      default: "USER",
      enum: ["USER", "ADMIN", "BOSS"],
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isVerify: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

schema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const model = mongoose.model("users", schema);

module.exports = model;
