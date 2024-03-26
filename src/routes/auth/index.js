const AuthController = require("../../controllers/auth");
const router = require("express").Router();
const { body } = require("express-validator");
const { validate } = require("../../middlewares/validation");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");

router.post(
  "/login",
  body("email", "Invalid email!").isEmail(),
  body("password").notEmpty().trim().withMessage("Password is missing!"),
  validate,
  asyncHandler(AuthController.login)
);

router.post(
  "/loginWithGoogle",
  asyncHandler(AuthController.loginWithGoogle)
);

router.post(
  "/adminLogin",
  body("email", "Invalid email!").isEmail(),
  body("password").notEmpty().trim().withMessage("Password is missing!"),
  validate,
  asyncHandler(AuthController.adminLogin)
);

router.post(
  "/adminLoginWithGoogle",
  asyncHandler(AuthController.adminLoginWithGoogle)
);

router.get(
  "/logged-in-account",
  authentication,
  AuthController.getLoggedInAccount
);

module.exports = router;
