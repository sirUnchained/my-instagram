const userModel = require("./../../models/user.model");
const postModel = require("./../../models/posts.model");
const { isValidObjectId } = require("mongoose");

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
