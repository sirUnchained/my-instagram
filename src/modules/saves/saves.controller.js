const checkAccess = require("../../utils/checkAccess");
const postModel = require("../../models/posts.model");
const saveModel = require("../../models/save.model");

exports.savePost = async (req, res, next) => {
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
      req.flash("err", "no access to save");
      return res.redirect("/");
    }

    const isSaveExist = await saveModel
      .findOne({ user: userID, post: postID })
      .lean();
    if (isSaveExist) {
      req.flash("err", "already saved");
      return res.redirect("/");
    }

    const newSave = new saveModel({ user: userID, post: postID });
    await newSave.save();

    return res.redirect("back");
  } catch (error) {
    next(error);
  }
};

exports.unsavePost = async (req, res, next) => {
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
      req.flash("err", "no access to save");
      return res.redirect("/");
    }

    const isSaveExist = await saveModel
      .findOne({ user: userID, post: postID })
      .lean();
    if (!isSaveExist) {
      req.flash("err", "already unsaved");
      return res.redirect("/");
    }

    await saveModel.deleteOne({ user: userID, post: postID });

    return res.redirect("back");
  } catch (error) {
    next(error);
  }
};
