const cloudUploader = require("../../middlewares/cloudUploader");
const { CreatedResponse } = require("../../response/success");
const UploadService = require("../../services/upload");

const router = require("express").Router();

router.post("/image", cloudUploader.single("image"), async (req, res) => {
  new CreatedResponse({
    message: "Image was uploaded!",
    metadata: await UploadService.uploadImage({
      path: req.file.path,
      filename: req.file.filename,
    }),
  }).send(res);
});

module.exports = router;
