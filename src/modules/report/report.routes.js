const express = require("express");
const router = express.Router();

const controller = require("./report.controller");
const authorization = require("../../middlewares/authorization");
const checkVerify = require("../../middlewares/checkVerify");

router
  .route("/new-report/:postID")
  .post(authorization, checkVerify, controller.newReport);

module.exports = router;
