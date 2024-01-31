const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "CT250-images",
  },
});

const cloudUploader = multer({ storage });

module.exports = cloudUploader;
