const express = require("express");
const router = express.Router();

const controller = require("./search.controller");
const authorization = require("../../middlewares/authorization");

router.route("/").post(authorization, controller.showSearchResult);

module.exports = router;
