const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const configs = require("../configENV");

async function checkUser(token) {
  try {
    const tokenData = jwt.verify(token, configs.accessTokenSecretKey);
    const user = await userModel
      .findOne({ email: tokenData.email }, "-password")
      .lean();
    return user;
  } catch (err) {
    return null;
  }
}

module.exports = checkUser;
