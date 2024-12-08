const express = require("express");
const router = express.Router();

const controller = require("./comments.controller");
const authorization = require("../../middlewares/authorization");
const checkVerify = require("../../middlewares/checkVerify");

router.route("/new").post(authorization, controller.newComment);

router
  .route("/remove/:commentID")
  .post(authorization, controller.removeComment);

router.route("/:id").get(authorization, controller.getSinglePostComments);

module.exports = router;
