async function isBoss(req, res, next) {
  if (req.user.role !== "BOSS") {
    req.flash("err", "you must be BOSS to do this.");
    return res.redirect("/");
  }
  next();
}

module.exports = isBoss;
