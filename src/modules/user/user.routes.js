const express = require("express");
const router = express.Router();

const controller = require("./user.controller");
const authorization = require("../../middlewares/authorization");
const isBoss = require("./../../middlewares/isBoss");

router.route("/ban/:userID").post(authorization, isBoss, controller.remove);

module.exports = router;
