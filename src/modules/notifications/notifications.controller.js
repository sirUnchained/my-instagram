const notificationModel = require("./../../models/notification.model");

exports.removeNotif = async (req, res, next) => {
  const { notifID } = req.params;
  const notif = await notificationModel
    .findOneAndDelete({ _id: notifID })
    .lean();
  if (!notif) {
    req.flash("err", "notification not found");
    return res.redirect("/");
  }

  return res.redirect("back");
};
