const express = require("express");
const router = express();

const controller = require("./auth.controller");
const validateCaptcha = require("../../middlewares/validateCaptcha");

router
  .route("/login")
  .get(controller.showLoginView)
  .post(validateCaptcha, controller.login);

router
  .route("/register")
  .get(controller.showRegisterView)
  .post(validateCaptcha, controller.register);

router
  .route("/forget-password")
  .get(controller.showForgetView)
  .post(controller.createForgetCode);

router
  .route("/recover-password/:token")
  .get(controller.showRecoveryView)
  .post(controller.changePassword);

module.exports = router;
