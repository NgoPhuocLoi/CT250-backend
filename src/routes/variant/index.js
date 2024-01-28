const { param, body } = require("express-validator");
const VariantController = require("../../controllers/variant");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { existVariant, validate } = require("../../middlewares/validation");
const { authentication, permission } = require("../../middlewares/auth");
const { ADMIN, EMPLOYEE } = require("../../constant/roles");

const router = require("express").Router();

router.get("", asyncHandler(VariantController.getAll));

router.get("/:id",
  param("id").custom(existVariant),
  validate,
  asyncHandler(VariantController.getOne)
);

// router.use(authentication);

router.post(
  "",
  // permission([ADMIN, EMPLOYEE]),
  body("quantity").isNumeric().withMessage("Quantity is not a number"),
  body("colorId").notEmpty().withMessage("Color id is missing"),
  body("sizeId").notEmpty().withMessage("Size id is missing"),
  body("productId").notEmpty().withMessage("Product id is missing"),
  validate,
  asyncHandler(VariantController.create)
);

router.put(
  "/:id",
  permission([ADMIN, EMPLOYEE]),
  param("id").custom(existVariant),
  validate,
  asyncHandler(VariantController.update)
);

router.delete(
  "/:id",
  permission([ADMIN, EMPLOYEE]),
  param("id").custom(existVariant),
  validate,
  asyncHandler(VariantController.delete)
);

module.exports = router;
