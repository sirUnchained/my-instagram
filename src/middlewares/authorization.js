const configs = require("../configENV");
const userModel = require("./../models/user.model");
const jwt = require("jsonwebtoken");

module.exports = async function auth(req, res, next) {
  try {
    const accessToken = req.cookies["accessToken"];
    if (!accessToken) {
      req.flash("err", "please sign in or sign up first.");
      return res.redirect("/auth/login");
    }
    const email = jwt.verify(accessToken, configs.accessTokenSecretKey)?.email;

    const user = await userModel.findOne({ email }, "-password").lean();
    if (!user) {
      req.flash("err", "pleas signup first.");
      return res.redirect("/auth/login");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
