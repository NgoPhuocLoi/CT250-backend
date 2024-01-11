const AuthController = require("../../controllers/auth");
const router = require("express").Router();
const { body } = require("express-validator");
const { validate, uniqueEmail } = require("../../middlewares/validation");

router.post(
  "/register",
  body("email")
    .notEmpty()
    .trim()
    .isEmail()
    .withMessage("Invalid email!")
    .custom(uniqueEmail),
  body("password")
    .notEmpty()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password should has at least 8 characters"),
  validate,
  AuthController.register
);

router.post("/login", AuthController.login);

module.exports = router;
