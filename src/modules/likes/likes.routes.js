const express = require("express");
const router = express.Router();

const controller = require("./likes.controller");
const authorization = require("../../middlewares/authorization");
const checkVerify = require("../../middlewares/checkVerify");

router
  .route("/like/:postID")
  .post(authorization, controller.likePost);

router
  .route("/dislike/:postID")
  .post(authorization, controller.dislikePost);

module.exports = router;
