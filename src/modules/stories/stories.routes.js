const express = require("express");
const router = express.Router();

const { multerConfig } = require("../../middlewares/uploader");
const controller = require("./stories.controller");
const authorization = require("../../middlewares/authorization");

const uploader = multerConfig("public/posts", /png|jpeg|webp|mp4/, true);

router
  .route("/")
  .get(authorization, controller.showUploadStoryView)
  .post(authorization, uploader.single("story"), controller.uploadStory);

router.route("/:userID").get(authorization, controller.getStories);

module.exports = router;
