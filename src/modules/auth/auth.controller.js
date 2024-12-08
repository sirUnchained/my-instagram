const userModel = require("./../../models/user.model");
const refreshTokenModel = require("./../../models/refreshToken.model");
const crypto = require("node:crypto");
const configs = require("../../configENV");

const path = require("node:path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const sendEmail = require("../../utils/sendEmail");
const { loginValidator, registerValidator } = require("./auth.validator");
const generateCaptcha = require("../../utils/captchaGenerator");
const redis = require("../../utils/redis");

exports.showLoginView = async (req, res, next) => {
  try {
    const captcha = await generateCaptcha();
    return res.render(
      path.join(__dirname, "..", "..", "views", "auth", "login.ejs"),
      { captcha }
    );
  } catch (error) {
    next(error);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { body, password } = req.body;
    await loginValidator.validate(req.body, { abortEarly: false });

    const checkUserExist = await userModel
      .findOne({ $or: [{ email: body }, { username: body }] })
      .lean();
    if (!checkUserExist) {
      req.flash("err", "user not found");
      return res.redirect("/auth/login");
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      checkUserExist.password
    );

    if (!isPasswordValid) {
      req.flash("err", "invalid datas");
      return res.redirect("/auth/login");
    }

    await refreshTokenModel.deleteMany({ user: checkUserExist._id });

    const accessToken = jwt.sign(
      {
        email: checkUserExist.email,
        username: checkUserExist.username,
        _id: checkUserExist._id,
      },
      configs.accessTokenSecretKey,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = await refreshTokenModel.createRefreshToken(
      checkUserExist._id
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    req.flash("succ", "login was successfully");
    return res.redirect("/");
  } catch (error) {
    next(error);
  }
};

exports.showRegisterView = async (req, res, next) => {
  try {
    const captcha = await generateCaptcha();
    return res.render(
      path.join(__dirname, "..", "..", "views", "auth", "register.ejs"),
      { captcha }
    );
  } catch (error) {
    next(error);
  }
};
exports.register = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    await registerValidator.validate(req.body, { abortEarly: false });

    const isUserDuplicated = await userModel.findOne({
      $or: [{ username: username?.toLowerCase().trim() }, { email }],
    });
    if (isUserDuplicated) {
      req.flash("err", "email or username already exist");
      return res.redirect("/auth/register");
    }

    const usersCount = await userModel.countDocuments();
    let role = "USER";
    if (usersCount === 0) {
      role = "BOSS";
    }

    const newUser = new userModel({
      name,
      username: username.trim(),
      email,
      password,
      role,
    });
    await newUser.save();

    const accessToken = jwt.sign(
      { email, username, _id: newUser._id },
      configs.accessTokenSecretKey,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = await refreshTokenModel.createRefreshToken(
      newUser._id
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // const accessToken = jwt.sign()

    req.flash("succ", "register was successfully");
    return res.redirect("/");

    // return res.status(201).send("register was successfully");
  } catch (error) {
    next(error);
  }
};

exports.showForgetView = async (req, res, next) => {
  return res.render(
    path.join(__dirname, "..", "..", "views", "auth", "forget.ejs")
  );
};
exports.createForgetCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email }).lean();
    if (!user) {
      req.flash("err", "email dose not exist");
      return res.redirect("/auth/forget-password");
    }

    const token = crypto.randomBytes(32).toString("hex");
    await redis.set(`forgetCode:${token}`, user._id, "EX", 60 * 3);

    const emailOption = {
      to: user.email,
      subject: "password recovery",
      text: "we send recovery password link for you",
      html: `
      <h1>Instagram</h1>
      <hr />
      <h2>hello ${user.name}.</h2>
      <p>you forgot your password and we send a recovery link for you, click in link below and change you'r password</p>
      <a href="${configs.baseURL}/auth/recover-password/${token}">recovery</a>
      `,
    };

    sendEmail(emailOption);
    req.flash("succ", "we send email to your account, check it.");
    res.redirect("/auth/forget-password");
  } catch (error) {
    next(error);
  }
};

exports.showRecoveryView = async (req, res, next) => {
  const { token } = req.params;
  const recoveryToken = await redis.get(`forgetCode:${token}`);
  if (!recoveryToken) {
    req.flash("err", "times up, send request again.");
    return res.redirect("/auth/forget-password");
  }
  return res.render(
    path.join(__dirname, "..", "..", "views", "auth", "recover.ejs"),
    { token }
  );
};
exports.changePassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const recoveryUser = await redis.get(`forgetCode:${token}`);
    await redis.del(`forgetCode:${token}`);

    if (!recoveryUser) {
      req.flash("err", "times up, send request again.");
      return res.redirect("/auth/forget-password");
    }

    const newPassword = await bcrypt.hash(password, 10);
    await userModel.findOneAndUpdate(
      { _id: recoveryUser },
      { $set: { password: newPassword } }
    );

    req.flash("succ", "password changed");
    return res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
};
