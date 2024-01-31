const cloudinary = require("cloudinary").v2;

cloudinary.config({
  secure: true,
});

class UploadService {
  static async destroyImage(filename) {
    return await cloudinary.uploader.destroy(filename);
  }
}

module.exports = UploadService;
