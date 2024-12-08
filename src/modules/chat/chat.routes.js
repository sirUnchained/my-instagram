const express = require("express");
const router = express.Router();

const controller = require("./chats.controller.js");
const authorization = require("../../middlewares/authorization");

router.route("/").get(authorization, controller.showChatsView);
router.route("/find").get(authorization, controller.searchForChat);
router.route("/new/:username").get(authorization, controller.createChat);

module.exports = router;
