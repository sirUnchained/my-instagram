const storyModel = require("./../../models/stories.model");

exports.showUploadStoryView = async (req, res, next) => {
  try {
    return res.send("story view");
  } catch (error) {
    next(error);
  }
};

exports.uploadStory = async (req, res, next) => {
  try {
    const filename = req.file?.key?.split("/");
    const media = {
      path: req.file.location,
      filename: filename[filename?.length - 1],
    };

    const newStory = new storyModel({
      media,
      user: req.user._id,
      createdAt: Date.now(),
    });
    await newStory.save();

    req.flash("succ", "story created.");
    return res.redirect(`/profile/${req.user.username}`);
  } catch (error) {
    next(error);
  }
};

exports.getStories = async (req, res, next) => {
  const { userID } = req.params;

  const userStories = await storyModel.findOne({ user: userID }).lean();

  res.send(userStories);
};
