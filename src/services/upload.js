const prisma = require("../config/prismaClient");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  secure: true,
});

class UploadService {
  static async uploadImage({ path, filename }) {
    return await prisma.uploadedImage.create({
      data: {
        path,
        filename,
      },
    });
  }

  static async destroyImage(uploadedImageId) {
    const uploadedImage = await prisma.uploadedImage.findUnique({
      where: {
        id: uploadedImageId,
      },
    });
    return await cloudinary.uploader.destroy(uploadedImage.filename);
  }
}

module.exports = UploadService;
