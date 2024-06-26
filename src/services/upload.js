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

  static async uploadImages(files) {
    return await Promise.all(
      files.map((file) =>
        prisma.uploadedImage.create({
          data: {
            path: file.path,
            filename: file.filename,
          },
        })
      )
    );
  }

  static async destroyImage(uploadedImageId) {
    const deletedImage = await prisma.uploadedImage.delete({
      where: {
        id: uploadedImageId,
      },
    });
    return await cloudinary.uploader.destroy(deletedImage.filename);
  }

  static destroyImageInDisk(uploadedImageFileName) {
    const fs = require("fs");
    fs.rmSync("uploads/" + uploadedImageFileName);
  }
}

module.exports = UploadService;
