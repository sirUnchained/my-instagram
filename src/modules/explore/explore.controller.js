const postModel = require("./../../models/posts.model");
const likeModel = require("./../../models/like.model");
const saveModel = require("./../../models/save.model");
const notifModel = require("./../../models/notification.model");

exports.showExplore = async (req, res, next) => {
  try {
    const currentUser = req.user;
    // const posts = await postModel.aggregate([{ $sample: { size: 10 } }]);
    let posts = await postModel
      .find()
      .populate("user", "username name avatar isPrivate")
      .lean();
    posts = posts
      .filter((post) => !post.user.isPrivate)
      .sort(() => Math.random() * 10 - 0.5);

    const likes = await likeModel.find().lean();

    // find likes and see is current user liked
    let totalLikes = 0;
    posts.forEach((post, index) => {
      totalLikes = 0;
      likes.forEach((like) => {
        if (like.post.toString() === post._id.toString()) {
          totalLikes++;
          post.totalLikes = totalLikes;
          if (currentUser._id.toString() === like.user.toString()) {
            posts[index].isLiked = true;
          }
        }
      });
      posts[index].totalLikes = totalLikes;
    });

    // find saves and see is current user saved
    let saves = null;
    saves = await saveModel.find({ user: currentUser._id }).lean();
    posts.forEach((post, index) => {
      saves.forEach((save) => {
        if (save.post.toString() === post._id.toString()) {
          if (currentUser._id.toString() === save.user.toString()) {
            posts[index].isSaved = true;
          }
        }
      });
    });

    // check user notifs
    let notifs = null;
    notifs = await notifModel
      .find({ notifFor: currentUser._id })
      .populate("notifCreator", "username avatar")
      .lean();
    currentUser.notifs = notifs;

    return res.render("explore/explore", {
      posts,
      currentUser,
    });
  } catch (error) {
    next(error);
  }
};
