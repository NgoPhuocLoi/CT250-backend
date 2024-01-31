const cloudUploader = require("../../middlewares/cloudUploader");
const { CreatedResponse } = require("../../response/success");

const router = require("express").Router();

router.post("/image", cloudUploader.single("image"), (req, res) => {
  new CreatedResponse({
    message: "Image was uploaded!",
    metadata: { path: req.file.path, filename: req.file.filename },
  }).send(res);
});

module.exports = router;
