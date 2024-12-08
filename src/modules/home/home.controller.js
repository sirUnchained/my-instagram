const postModel = require("./../../models/posts.model");
const userModel = require("./../../models/user.model");
const likeModel = require("./../../models/like.model");
const saveModel = require("./../../models/save.model");
const storyModel = require("./../../models/stories.model");
const notifModel = require("./../../models/notification.model");
const checkUser = require("../../utils/checkUser");

exports.showHome = async (req, res, next) => {
  try {
    const currentUser = await checkUser(req.cookies["accessToken"]);
    // const posts = await postModel.aggregate([{ $sample: { size: 10 } }]);
    let posts = await postModel
      .find()
      .populate("user", "username name avatar isPrivate")
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

    // check user notifs
    let notifs = null;
    if (currentUser) {
      notifs = await notifModel
        .find({ notifFor: currentUser._id })
        .populate("notifCreator", "username avatar")
        .lean();
      currentUser.notifs = notifs;
    }

    // recomend users
    const recomendUsers = await userModel.find({ isPrivate: false }).lean();
    recomendUsers.forEach((user, index) => {
      stories.forEach((story) => {
        if (user._id.toString() === story.user.toString()) {
          recomendUsers[index].hasStory = true;
        }
      });
      if (user._id.toString() === currentUser?._id.toString()) {
        recomendUsers.splice(index, 1);
      }
    });
    recomendUsers.forEach((user, index) => {
      stories.forEach((story) => {
        if (user._id.toString() === story.user.toString()) {
          recomendUsers[index].hasStory = true;
        }
      });
    });

    return res.render("index", {
      posts,
      currentUser,
      recomendUsers,
    });
  } catch (error) {
    next(error);
  }
};
