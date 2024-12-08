const reportModel = require("../../models/report.model");
const postModel = require("./../../models/posts.model");

exports.newReport = async (req, res, next) => {
  const userID = req.user._id;
  const { postID } = req.params;
  const post = await postModel.findById({ _id, postID }).lean();
  if (!post) {
    req.falsh("err", "post not found, user may deleted the post");
    return res.redirect("/");
  }

  const newReport = new reportModel({ reporter: userID, reportedPost: postID });
  await newReport.save();

  req.falsh("succ", "post reported.")
  return res.redirect("/")
};
