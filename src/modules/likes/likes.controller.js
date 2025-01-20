const checkAccess = require("../../utils/checkAccess");
const likeModel = require("./../../models/like.model");
const postModel = require("./../../models/posts.model");

exports.likePost = async (req, res, next) => {
  try {
    const { postID } = req.params;
    const userID = req.user._id;

    const post = await postModel
      .findOne({ _id: postID })
      .populate("user", "-password")
      .lean();
    if (!post) {
      req.flash("err", "post not found");
      return res.redirect("/");
    }

    const hasAccess = await checkAccess(post.user, req.user);
    if (!hasAccess) {
      req.flash("err", "post not found");
      return res.redirect("/");
    }

    const islikeExist = await likeModel
      .findOne({ user: userID, post: postID })
      .lean();
    if (islikeExist) {
      req.flash("err", "post not found");
      return res.redirect("/");
    }

    const newLike = new likeModel({ user: userID, post: postID });
    await newLike.save();

    return res.redirect("back");
  } catch (error) {
    next(error);
  }
};

exports.dislikePost = async (req, res, next) => {
  try {
    const { postID } = req.params;
    const userID = req.user._id;

    const post = await postModel
      .findOne({ _id: postID })
      .populate("user", "-password")
      .lean();
    if (!post) {
      req.flash("err", "post not found");
      return res.redirect("/");
    }

    const hasAccess = await checkAccess(post.user, req.user);
    if (!hasAccess) {
      req.flash("err", "post not found");
      return res.redirect("/");
    }

    const islikeExist = await likeModel
      .findOne({ user: userID, post: postID })
      .lean();
    if (!islikeExist) {
      req.flash("err", "post not found");
      return res.redirect("/");
    }

    await likeModel.deleteOne({ user: userID, post: postID });

    return res.redirect("back");
  } catch (error) {
    next(error);
  }
};
