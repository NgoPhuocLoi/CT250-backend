const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/categories", require("./category"));

module.exports = router;
