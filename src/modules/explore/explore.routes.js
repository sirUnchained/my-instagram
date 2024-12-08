const express = require("express");
const router = express.Router();

const controller = require("./explore.controller");
const authorization = require("../../middlewares/authorization");

router.route("/").get(authorization, controller.showExplore);

module.exports = router;
