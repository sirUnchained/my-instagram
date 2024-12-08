const express = require("express");
const router = express.Router();

const controller = require("./notifications.controller");
const authorization = require("../../middlewares/authorization");
const checkVerify = require("../../middlewares/checkVerify");

router.route("/remove/:notifID").post(authorization, controller.removeNotif)

module.exports = router;
