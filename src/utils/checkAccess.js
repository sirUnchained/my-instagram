const followModel = require("./../models/follow.model");

async function checkAccess(page, user) {
  if (page._id.toString() === user._id.toString()) return true;

  // if (user.role === "ADMIN" || user.role === "BOSS") return true;

  const isFollowing = await followModel.findOne({
    follower: user._id,
    following: page._id,
  });
  if (isFollowing) {
    return true;
  }

  if (page.isPrivate) return false;

  return true;
}

module.exports = checkAccess;
