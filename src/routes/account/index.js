const AccountController = require("../../controllers/account");
const router = require("express").Router();
const { body } = require("express-validator");
const { asyncHandler } = require("../../middlewares/asyncHandler");

router.get("/", asyncHandler(AccountController.getAll));
router.delete("/", asyncHandler(AccountController.deleteAll));

module.exports = router;
