const userModel = require("./../../models/user.model");
const postModel = require("./../../models/posts.model");
const { isValidObjectId } = require("mongoose");

exports.getMe = async (req, res, next) => {
  try {
    return res
      .status(200)
      .json({ user: req.user, token: req.cookies["accessToken"] });
  } catch (error) {
    next(error);
  }
};

exports.findUser = async (req, res, next) => {
  try {
    const { username } = req.query;
    const user = req.user;

    if (username?.trim().length == 0) {
      return res.status(200).json([]);
    }

    const users = await userModel.find({
      username: {
        $regex: username,
        $options: "i",
      },
    });

    const isCurrenUserInList = users.findIndex(
      (searchUser) => searchUser.username === user.username
    );
    if (isCurrenUserInList != -1) {
      users.splice(isCurrenUserInList, 1);
    }

    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { userID } = req.params;
    if (!isValidObjectId(userID)) {
      req.falsh("err", "user not found.");
      return res.redirect("/");
    }

    const removedUser = await userModel.findOneAndDelete({ _id: userID });
    if (!removedUser) {
      req.falsh("err", "user not found.");
      return res.redirect("/");
    }

    const posts = await postModel.find({ user: userID }).lean();
    const medias = [];
    posts.forEach((post) => {
      post.medias.forEach((media) => {
        medias.push(media);
      });
    });

    req.falsh("succ", "user banned.");
    return res.redirect("/");
  } catch (error) {
    next(error);
  }
};
