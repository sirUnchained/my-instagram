const bcrypt = require("bcryptjs");

const userModel = require("./../../models/user.model");
const postModel = require("./../../models/posts.model");
const saveModel = require("./../../models/save.model");
const storyModel = require("./../../models/stories.model");
const followModel = require("./../../models/follow.model");
const notifModel = require("../../models/notification.model");

const { editProfileValidator } = require("./profile.validator");
const checkAccess = require("../../utils/checkAccess");
const { removeSingle } = require("../../utils/removeFile");
const fs = require("node:fs");

exports.showProfileView = async (req, res, next) => {
  try {
    const { username } = req.params;
    const page = await userModel.findOne({ username }, "-password").lean();
    const visitor = req.user;
    let visitorSaves = null;

    if (!page) {
      req.flash("err", "user dose not exist");
      return res.redirect("/");
    }

    const isFollowing = await followModel.findOne({
      follower: visitor._id,
      following: page._id,
    });

    const isOwn = page._id.toString() === visitor._id.toString();

    const hasAccess = await checkAccess(page, visitor);
    if (!hasAccess) {
      req.flash("err", "user page is private, follow him to see posts.");
      return res.render("profile/profile", {
        visitor,
        isOwn,
        isFollowing,
        page,
        hasAccess,
        visitorSaves,
        pagePosts: null,
        pageStory: null,
        pageFollowers: null,
        pageFollowngs: null,
      });
    }

    const pageStory = await storyModel.find({ user: page._id }).lean();

    const pagePosts = await postModel
      .find({ user: page._id })
      .populate("user", "user username");

    const pageFollowers = await followModel
      .find({ following: page._id })
      .lean();

    const pageFollowngs = await followModel.find({ follower: page._id }).lean();

    if (isOwn) {
      visitorSaves = await saveModel
        .find({ user: visitor._id })
        .populate({
          path: "post",
          populate: {
            path: "user",
            model: "users",
          },
        })
        .lean();
    }

    // visitor notifs
    let notifs = null;
    notifs = await notifModel
      .find({ notifFor: visitor._id })
      .populate("notifCreator", "username avatar")
      .lean();
    visitor.notifs = notifs;

    return res.render("profile/profile", {
      visitor,
      isFollowing,
      isOwn,
      page,
      hasAccess,
      visitorSaves,
      pagePosts,
      pageStory,
      pageFollowers,
      pageFollowngs,
    });
  } catch (error) {
    next(error);
  }
};

exports.follow = async (req, res, next) => {
  try {
    const { username } = req.params;
    const follower = req.user;
    const following = await userModel.findOne({ username });

    if (follower.username === username) {
      req.flash("err", "you cant follow yourself");
      return res.redirect("/");
    }

    if (!following) {
      req.flash("err", "following user not found");
      return res.redirect("/");
    }

    const hasFollow = await followModel.findOne({
      follower: follower._id,
      following: following._id,
    });
    if (hasFollow) {
      req.flash("err", "you alredy follow him");
      return res.redirect("/");
    }

    const checkNotif = await notifModel.findOne({
      notifCreator: follower,
      notifFor: following,
    });

    if (checkNotif) {
      await checkNotif.deleteOne();
    } else {
      notifModel.followNotif(follower, following);
    }

    return res.redirect(`/profile/${following.username}`);
  } catch (error) {
    next(error);
  }
};

exports.unfollow = async (req, res, next) => {
  try {
    const { username } = req.params;
    const follower = req.user;
    const following = await userModel.findOne({ username });

    if (follower.username === username) {
      req.flash("err", "you cant unfollow yourself");
      return res.redirect("/");
    }

    if (!following) {
      req.flash("err", "unfollowing user not found");
      return res.redirect("/");
    }

    const hasFollow = await followModel.findOne({
      follower: follower._id,
      following: following._id,
    });
    if (!hasFollow) {
      req.flash("err", "you alredy unfollow him");
      return res.redirect("/");
    }

    await followModel.findOneAndDelete({
      follower: follower._id,
      following: following._id,
    });

    return res.redirect("/");
  } catch (error) {
    next(error);
  }
};

exports.acceptFollower = async (req, res, next) => {
  try {
    const { notifId } = req.params;
    const user = req.user;

    const checkNotif = await notifModel.findById(notifId);
    if (!checkNotif) {
      return res.status(404).json({ message: "notification not found." });
    }
    if (user.id.toString() !== checkNotif.notifFor.toString()) {
      return res
        .status(400)
        .json({ message: "this notification is not for you !" });
    }

    const newFollow = new followModel({
      follower: checkNotif.notifCreator,
      following: checkNotif.notifFor,
    });
    await newFollow.save();

    return res
      .status(200)
      .json({ message: "now you've got another follower !" });
  } catch (error) {
    next(error);
  }
};

exports.rejectFollower = async (req, res, next) => {
  try {
    const { notifId } = req.params;
    const user = req.user;

    const checkNotif = await notifModel.findById(notifId);
    if (!checkNotif) {
      return res.status(404).json({ message: "notification not found." });
    }
    if (user.id.toString() !== checkNotif.notifFor.toString()) {
      return res
        .status(400)
        .json({ message: "this notification is not for you !" });
    }

    await notifModel.findByIdAndDelete(notifId);

    return res
      .status(200)
      .json({ message: "ok that user cannot follow you !" });
  } catch (error) {
    next(error);
  }
};

exports.showEditProfile = async (req, res, next) => {
  const visitor = req.user;
  const { username } = req.params;

  const updatingUser = await userModel.findOne({ username }).lean();
  if (!updatingUser) {
    req.flash("err", "you can't update user profile that dose not exist.");
    return res.redirect(`/profile/${username}`);
  }

  const hasAccess = visitor._id.toString() === updatingUser._id.toString();
  if (!hasAccess) {
    req.flash("err", "son, you can't change another person profile ...");
    return res.redirect(`/profile/${username}`);
  }

  return res.render("editProfile/editProfile", { user: req.user });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const visitor = req.user;
    const { username } = req.params;

    const updatingUser = await userModel.findOne({ username }).lean();
    if (!updatingUser) {
      req.flash("err", "you can't update user profile that dose not exist.");
      return res.redirect(`/profile/${username}`);
    }

    const hasAccess = await checkAccess(visitor, updatingUser);
    if (!hasAccess) {
      req.flash("err", "son, you can't change another person profile.");
      return res.redirect(`/profile/${username}`);
    }

    await editProfileValidator.validate(req.body, { abortEarly: false });

    if (!req.file) {
      req.flash("err", "profile photo is require.");
      return res.redirect(`/profile/${username}`);
    }

    const path = req.file.location;

    req.body.password = await bcrypt.hash(req.body.password, 10);

    await userModel.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { ...req.body, avatar: path } }
    );

    // removeSingle("public/" + req.file.path);

    req.flash("succ", "profile updated.");
    return res.redirect(`/profile/${req.user.username}`);
  } catch (error) {
    next(error);
  }
};

exports.changePrivity = async (req, res, next) => {
  try {
    const user = req.user;
    if (req.user.isPrivate) {
      await userModel.updateOne(
        { _id: user._id },
        { $set: { isPrivate: false } }
      );
      req.flash("succ", "you'r page is now public.");
      return res.redirect(`/profile/${user.username}`);
    } else {
      await userModel.updateOne(
        { _id: user._id },
        { $set: { isPrivate: true } }
      );
      req.flash("succ", "you'r page is now private.");
      return res.redirect(`/profile/${user.username}`);
    }
  } catch (error) {
    next(error);
  }
};
