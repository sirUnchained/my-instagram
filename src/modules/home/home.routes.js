const express = require("express");
const router = express.Router();

const controller = require('./home.controller');

router.route("/").get(controller.showHome);

module.exports = router;
