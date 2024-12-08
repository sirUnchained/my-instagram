const fs = require("node:fs");

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

function removeFile(medias = []) {
  medias.forEach(async (media) => {
    const path = media.path.slice(51);
    const command = new AWS.DeleteObjectCommand({
      Bucket: configs.bucketName,
      Key: path,
    });
    try {
      await s3.send(command);
    } catch (err) {
      console.error(`Error deleting ${path}:`, err);
    }
  });
}
function removeSingle(destination) {
  if (fs.existsSync("/", destination)) {
    fs.unlinkSync("/", destination);
    return 0;
  }
}

module.exports = { removeFile, removeSingle };
