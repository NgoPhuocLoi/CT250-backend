const { CreatedResponse, OKResponse } = require("../response/success");
const UploadService = require("../services/upload");

class UploadController {
  static async uploadImage(req, res) {
    new CreatedResponse({
      message: "Image was uploaded!",
      metadata: await UploadService.uploadImage({
        path: req.file.path,
        filename: req.file.filename,
      }),
    }).send(res);
  }

  static async destroyImage(req, res) {
    new OKResponse({
      metadata: await UploadService.destroyImage(+req.params.uploadedImageId),
    }).send(res);
  }
}

module.exports = UploadController;
