const { authentication } = require("../middlewares/auth");

const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/categories", require("./category"));
router.use("/accounts", require("./account"));
router.use("/products", require("./product"));
router.use("/colors", require("./color"));
router.use("/sizes", require("./size"));
router.use("/variants", require("./variant"));

module.exports = router;
