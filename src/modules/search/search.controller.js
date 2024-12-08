const userModel = require("./../../models/user.model");

exports.showSearchResult = async (req, res, next) => {
  try {
    const { username } = req.body;
    let result = null;

    if (username?.trim()) {
      result = await userModel
        .find({ username })
        .select("username avatar")
        .lean();
    } else {
      result = await userModel.find().select("username avatar").lean();
    }

    return res.render("search/search", {
      result,
    });
  } catch (error) {
    next(error);
  }
};
