const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyID,
  secretAccessKey: process.env.secretAcessKey,
  region: process.env.REGION,
});

const storage = multerS3({
  s3: s3,
  bucket: "project-portfolio-upload",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: "public-read",
  metadata: function (req, file, cb) {
    cb(null, { filedName: file.filedname });
  },
  key: function (req, file, cb) {
    cb(null, `uploads/${Date.now()}_${file.originalname}`);
  },
});

exports.upload = multer({ storage: storage });
