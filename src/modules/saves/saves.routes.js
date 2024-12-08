const express = require("express");
const router = express.Router();

const controller = require("./saves.controller");
const authorization = require("../../middlewares/authorization");
const checkVerify = require("../../middlewares/checkVerify");

router
  .route("/save/:postID")
  .post(authorization, controller.savePost);

router
  .route("/unsave/:postID")
  .post(authorization, controller.unsavePost);

module.exports = router;
