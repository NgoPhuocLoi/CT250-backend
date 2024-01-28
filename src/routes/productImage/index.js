const { param, body } = require("express-validator");
const ProductImageController = require("../../controllers/productImage");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { existProductImage, validate } = require("../../middlewares/validation");
const { authentication, permission } = require("../../middlewares/auth");
const { ADMIN, EMPLOYEE } = require("../../constant/roles");

const router = require("express").Router();

router.get("", asyncHandler(ProductImageController.getAll));

router.get("/:id",
  param("id").custom(existProductImage),
  validate,
  asyncHandler(ProductImageController.getOne)
);

// router.use(authentication);

router.post(
  "",
  // permission([ADMIN, EMPLOYEE]),
  body("url").notEmpty().withMessage("Url is missing"),
  body("productId").notEmpty().withMessage("ProductId is missing"),
  validate,
  asyncHandler(ProductImageController.create)
);

router.put(
  "/:id",
  // permission([ADMIN, EMPLOYEE]),
  param("id").custom(existProductImage),
  validate,
  asyncHandler(ProductImageController.update)
);

router.delete(
  "/:id",
  // permission([ADMIN, EMPLOYEE]),
  param("id").custom(existProductImage),
  validate,
  asyncHandler(ProductImageController.delete)
);

module.exports = router;
