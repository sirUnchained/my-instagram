const postModel = require("./../../models/posts.model");
const likeModel = require("./../../models/like.model");
const saveModel = require("./../../models/save.model");
const storyModel = require("./../../models/stories.model");
const reportModel = require("./../../models/report.model");
const notifModel = require("./../../models/notification.model");

const { postValidator } = require("./post.validator");
const { removeFile } = require("../../utils/removeFile");
const checkUser = require("./../../utils/checkUser");

exports.showUploadView = async (req, res, next) => {
  try {
    return res.send("upload view");
  } catch (error) {
    next(error);
  }
};

exports.getPaginatedPosts = async (req, res, next) => {
  try {
    const { page } = req.params;
    const currentUser = await checkUser(req.cookies["accessToken"]);
    let posts = await postModel
      .find()
      .populate("user", "username name avatar isPrivate")
      .limit(3)
      .skip((page - 1) * 3)
      .lean();
    posts = posts
      .filter((post) => !post.user.isPrivate)
      .sort(() => 0.5 - Math.random());

    const likes = await likeModel.find().lean();

    const stories = await storyModel.find({}).lean();

    // find likes and see is current user liked
    let totalLikes = 0;
    posts.forEach((post, index) => {
      totalLikes = 0;
      likes.forEach((like) => {
        if (like.post.toString() === post._id.toString()) {
          totalLikes++;
          post.totalLikes = totalLikes;
          if (
            currentUser &&
            currentUser._id.toString() === like.user.toString()
          ) {
            posts[index].isLiked = true;
          }
        }
      });
      posts[index].totalLikes = totalLikes;
    });

    posts.forEach((post, index) => {
      stories.forEach((story) => {
        if (post.user._id.toString() === story.user.toString()) {
          posts[index].hasStory = true;
        }
      });
    });

    // find saves and see is current user saved
    let saves = null;
    if (currentUser) {
      saves = await saveModel.find({ user: currentUser._id }).lean();
      posts.forEach((post, index) => {
        saves.forEach((save) => {
          if (save.post.toString() === post._id.toString()) {
            if (
              currentUser &&
              currentUser._id.toString() === save.user.toString()
            ) {
              posts[index].isSaved = true;
            }
          }
        });
      });
    }

    const docsCount = await postModel.countDocuments();
    const isEnd = (docsCount - (page * 3)) < 0;

    res.status(200).json({ currentUser, posts, isEnd, limit: 3 });
  } catch (error) {
    next(error);
  }
};

exports.uploadPost = async (req, res, next) => {
  try {
    const user = req.user._id;
    const { description, hashtags } = req.body;

    await postValidator.validate(req.body, { abortEarly: false });

    const medias = req.files.map((file) => {
      const filename = file?.key?.split("/");
      return {
        path: file.location,
        filename: filename[filename?.length - 1],
      };
    });

    const newPost = new postModel({
      user,
      medias,
      description,
      hashtags: hashtags?.trim() ? hashtags.split(" ") : null,
    });
    await newPost.save();

    req.flash("succ", "post created");
    return res.redirect(`/profile/${req.user.username}`);
  } catch (error) {
    next(error);
  }
};

exports.getSingle = async (req, res, next) => {
  try {
    const user = req.user;
    const { postID } = req.params;

    const post = await postModel
      .findOne({ _id: postID })
      .populate("user", "username avatar")
      .lean();

    const likes = await likeModel.find({}).lean();

    const isSaved = await saveModel
      .findOne({ user: user._id, post: postID })
      .lean();

    const stories = await storyModel.find({ user: post._id }).lean();
    post.stories = stories;

    let likesCount = 0;
    likes.forEach((like) => {
      if (like.post.toString() === post._id.toString()) {
        likesCount++;
      }
      if (
        like.post.toString() === postID &&
        like.user.toString() === user._id.toString()
      ) {
        post.isLiked = true;
      }
    });
    post.likesCount = likesCount;

    if (isSaved) {
      post.isSaved = true;
    }

    res.send(post);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { postID } = req.params;
    const post = await postModel.findOneAndDelete({ _id: postID }).lean();
    if (!post) {
      req.flash("err", "post not found");
      return res.redirect("/");
    }
    await saveModel.deleteMany({ post: postID });
    await likeModel.deleteMany({ post: postID });
    await reportModel.deleteMany({ reportedPost: postID });
    await notifModel.deleteMany({ likedPost: postID });

    removeFile(post.medias);

    req.flash("succ", "post removed");
    return res.redirect("/");
  } catch (error) {
    next(error);
  }
};

exports.report = async (req, res, next) => {
  try {
    const { postID } = req.params;
    const post = await postModel
      .findOne({ _id: postID })
      .populate("user", "-password")
      .lean();
    if (!post) {
      req.flash("err", "post not found");
      return res.redirect("/");
    }

    const newReport = new reportModel({
      reporter: req.user._id,
      reportedPost: post._id,
    });
    await newReport.save();

    req.flash("succ", "post reported.");
    return res.redirect("/");
  } catch (error) {
    next(error);
  }
};
