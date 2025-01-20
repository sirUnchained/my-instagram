const express = require("express");
const router = express.Router();

const controller = require("./profiles.controller");
const authorization = require("../../middlewares/authorization");
const { multerConfig } = require("./../../middlewares/uploader");
const checkVerify = require("../../middlewares/checkVerify");

const uploader = multerConfig("public/profiles", /jpeg|jpg|png|webp/);

router.route("/change-privity").get(authorization, controller.changePrivity);

router.route("/follow/:username").get(authorization, controller.follow);

router.route("/unfollow/:username").get(authorization, controller.unfollow);

// router.route("/accept-follower")

// router.route("/reject-follower")

router
  .route("/edit/:username")
  .post(authorization, uploader.single("profile"), controller.updateProfile)
  .get(authorization, controller.showEditProfile);

router.route("/:username").get(authorization, controller.showProfileView);

module.exports = router;
