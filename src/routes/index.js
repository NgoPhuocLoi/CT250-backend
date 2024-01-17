const { authentication } = require("../middlewares/auth");

const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/categories", require("./category"));
router.use("/accounts", require("./account"));

module.exports = router;
