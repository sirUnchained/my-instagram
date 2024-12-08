const path = require("node:path");
const multer = require("multer");

const multerS3 = require("multer-s3");
const AWS = require("@aws-sdk/client-s3");
const configs = require("../configENV");

const config = {
  region: "default",
  endpoint: configs.bucketEndPoint,
  credentials: {
    accessKeyId: configs.bucketAccessKey,
    secretAccessKey: configs.bucketSecretKey,
  },
};

const s3 = new AWS.S3(config);

exports.multerConfig = (
  destination,
  validTypes = /png|jpeg|webp|mp4/,
  isStory = false
) => {
  /*
  const storage = multer.diskStorage({
    destination: function (req, file, ch) {
      const postPath = `${destination}/${req.user.username}`;
      if (!fs.existsSync(postPath)) {
        fs.mkdirSync(postPath);
      }
      
      if (isStory) {
        const storyPath = `${destination}/${req.user.username}/stories`;
        if (!fs.existsSync(storyPath)) {
          fs.mkdirSync(storyPath);
        }
        ch(null, storyPath);

      } else {
        ch(null, postPath);
      }
    },
    filename: function (req, file, ch) {
      const name = Date.now() * Math.floor(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      ch(null, name + ext);
    },
  });

  const uploader = multer({
    storage,
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
    fileFilter: function (req, file, ch) {
      if (validTypes.test(file.mimetype)) {
        ch(null, true);
      } else {
        ch(new Error("file type not allowed"));
      }
    },
  });
*/

  const uploader = multer({
    storage: multerS3({
      s3,
      bucket: configs.bucketName,
      key: function (req, file, callback) {
        const userDir = req.user.username; // Get the username from the request
        const randomName = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);

        if (!validTypes.test(file.mimetype)) {
          return callback(new Error("file format not supported"));
        }

        let fullPath = "";
        if (isStory) {
          fullPath = `instagram/${destination}/${userDir}/stories/${randomName}${ext}`;
        } else {
          fullPath = `instagram/${destination}/${userDir}/${randomName}${ext}`;
        }

        callback(null, fullPath);
      },
    }),
    limits: {
      fileSize: 50 * 1024 * 1024,
    },
    fileFilter: function (req, file, callback) {
      if (validTypes.test(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new Error("file type not allowed"));
      }
    },
  });

  return uploader;
};
