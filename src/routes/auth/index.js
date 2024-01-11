const AuthController = require("../../controllers/auth");
const router = require("express").Router();
const { body } = require("express-validator");
const { validate, uniqueEmail } = require("../../middlewares/validation");
const { asyncHandler } = require("../../middlewares/asyncHandler");

router.post(
  "/register",
  body("email").isEmail().withMessage("Invalid email!").custom(uniqueEmail),
  body("password")
    .notEmpty()
    .withMessage("Password is missing")
    .isLength({ min: 8 })
    .withMessage("Password should have at least 8 characters"),
  validate,
  asyncHandler(AuthController.register)
);

router.post(
  "/login",
  body("email", "Invalid email!").isEmail(),
  body("password").notEmpty().trim().withMessage("Password is missing"),
  validate,
  asyncHandler(AuthController.login)
);

module.exports = router;
