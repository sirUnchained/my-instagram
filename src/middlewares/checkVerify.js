function checkVerify(req, res, next) {
  if (!req.user.isVerify) {
    return res.send("you are not verify!");
  }
  next();
}

module.exports = checkVerify;
