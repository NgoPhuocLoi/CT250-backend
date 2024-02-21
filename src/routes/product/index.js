const { param, body, query } = require("express-validator");
const ProductController = require("../../controllers/product");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const {
  existProduct,
  existProductWithSlug,
  validate,
  existProductImage,
  existCategory,
  existUploadedImage,
} = require("../../middlewares/validation");
const { authentication, permission } = require("../../middlewares/auth");
const { ADMIN, EMPLOYEE } = require("../../constant/roles");
const cloudUploader = require("../../middlewares/cloudUploader");
const { PRODUCT_QUERY_TYPES } = require("../../constant/productType");

const router = require("express").Router();

router.get(
  "",
  query("type")
    .notEmpty()
    .withMessage("Product query type is missing!")
    .isIn(PRODUCT_QUERY_TYPES)
    .withMessage("Unknown product query type"),
  query("limit").isNumeric().withMessage("Limit should be a number"),
  query("categoryIds.*")
    .isNumeric()
    .withMessage("CategoryIds should be an integer array"),
  validate,
  asyncHandler(ProductController.getAll)
);

router.get(
  "/:id",
  param("id").custom(existProduct),
  validate,
  asyncHandler(ProductController.getOne)
);

router.get(
  "/slug/:slug",
  param("slug").custom(existProductWithSlug),
  validate,
  asyncHandler(ProductController.getOneBySlug)
);

// router.use(authentication);

router.post(
  "",
  // permission([ADMIN, EMPLOYEE]),
  body("name").notEmpty().withMessage("Name is missing"),
  body("price").notEmpty().withMessage("Price is missing"),
  body("description").notEmpty().withMessage("Description is missing"),
  body("material").notEmpty().withMessage("Material is missing"),
  body("overview").notEmpty().withMessage("Overview is missing"),
  body("instruction").notEmpty().withMessage("Instruction is missing"),
  body("categoryId").custom(existCategory),
  body("uploadedImageIds")
    .isArray()
    .withMessage("uploadedImageIds should be an array"),

  validate,
  asyncHandler(ProductController.create)
);

router.put(
  "/:id",
  // permission([ADMIN, EMPLOYEE]),
  param("id").custom(existProduct),
  validate,
  asyncHandler(ProductController.update)
);

router.delete(
  "/:id",
  // permission([ADMIN, EMPLOYEE]),
  param("id").custom(existProduct),
  validate,
  asyncHandler(ProductController.delete)
);

router.post(
  "/:id/add-image",
  param("id").custom(existProduct),
  body("uploadedImageId")
    .notEmpty()
    .withMessage("uploadedImageId is missing")
    .custom(existUploadedImage),
  validate,
  asyncHandler(ProductController.addImage)
);

// router.delete(
//   "/delete-image/:imageId",
//   param("imageId").custom(existProductImage),
//   validate,
//   asyncHandler(ProductController.deleteImage)
// );

module.exports = router;
