const express = require("express");
const router = express.Router();

const { multerConfig } = require("../../middlewares/uploader");
const controller = require("./posts.controller");
const authorization = require("../../middlewares/authorization");

const isBoss = require("./../../middlewares/isBoss");

const uploader = multerConfig("public/posts", /png|jpeg|webp|mp4/);

router.route("/").get(authorization, controller.showUploadView);

router.route("/posts/:page").get(controller.getPaginatedPosts);

router
  .route("/")
  .post(authorization, uploader.array("posts", 5), controller.uploadPost);

router.route("/get-single/:postID").get(authorization, controller.getSingle);

router.route("/report/:postID").post(authorization, controller.report);

router.route("/remove/:postID").post(authorization, isBoss, controller.remove);

module.exports = router;
