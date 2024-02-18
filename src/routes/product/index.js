const { param, body, query } = require("express-validator");
const ProductController = require("../../controllers/product");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const {
  existProduct,
  existProductWithSlug,
  validate,
  existProductImage,
  existCategory,
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
  body("images")
    .notEmpty()
    .withMessage("Product's images are missing")
    .isArray()
    .withMessage("Product's images should be an array"),
  body("images.*.path")
    .notEmpty()
    .withMessage("Image's path is missing")
    .isString()
    .withMessage("Image's path should be a string"),
  body("images.*.filename")
    .notEmpty()
    .withMessage("Image's filename is missing")
    .isString()
    .withMessage("Image's filename should be a string"),
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
  body("path").notEmpty().withMessage("Image's path is missing"),
  body("filename").notEmpty().withMessage("Image's filename is missing"),
  validate,
  asyncHandler(ProductController.addImage)
);

router.delete(
  "/delete-image/:imageId",
  param("imageId").custom(existProductImage),
  validate,
  asyncHandler(ProductController.deleteImage)
);

module.exports = router;
