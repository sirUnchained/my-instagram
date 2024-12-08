const commentModel = require("../../models/comments.model");
const userModel = require("../../models/user.model");
const postModel = require("../../models/posts.model");

const { commentsValidation } = require("./comments.validation");
const checkAccess = require("./../../utils/checkAccess");

exports.newComment = async (req, res, next) => {
  try {
    const { post, parent, body } = req.body;
    const user = req.user._id;
    await commentsValidation.validate({ body }, { abortEarly: false });

    const checkPost = await postModel.findOne({ _id: post }).lean();
    let checkParent = null;
    if (parent) {
      checkParent = await commentModel.findOne({ _id: post }).lean();
      if (!checkParent) {
        req.flash("err", "replied comment not found");
        return res.redirect("/");
      }
    }

    if (!checkPost) {
      req.flash("err", "user or post not found");
      return res.redirect("/");
    }

    const newComment = new commentModel({
      user,
      post,
      parent,
      body,
    });
    await newComment.save();

    req.flash("succ", "comment saved");
    return res.redirect("/explore");
  } catch (error) {
    next(error);
  }
};

exports.removeComment = async (req, res, next) => {
  try {
    const { commentID } = req.params;
    const user = req.user;

    const checkComment = await commentModel
      .findOne({ _id: commentID })
      .populate("user", "-password")
      .lean();
    if (!checkComment) {
      req.flash("err", "comment not found");
      return res.redirect("/");
    }

    const hasAccess = await checkAccess(user, checkComment.user);
    if (!hasAccess) {
      req.flash("err", "no access to remove this comment");
      return res.redirect("/");
    }

    await commentModel.deleteOne({ _id: commentID });

    req.flash("succ", "comment removed");
    return res.redirect("/");
  } catch (error) {
    next(error);
  }
};

exports.getSinglePostComments = async (req, res, next) => {
  try {
    const { id: postID } = req.params;
    const post = await postModel
      .findById({ _id: postID })
      .lean();
    if (!post) {
      return res.send("post not found");
    }

    const comments = await commentModel
      .find({ post: postID })
      .populate("user", "user, username")
      .lean();
    let parentComments = [];

    comments.forEach((commentP, index) => {
      if (commentP.parent === null) {
        commentP.replies = [];
        comments.forEach((commentC) => {
          if (commentC.parent?.toString() === commentP._id.toString()) {
            commentP.replies.push(commentC);
          }
        });
        parentComments.push(commentP);
      }
    });

    return res.json(parentComments);
  } catch (error) {
    next(error);
  }
};
