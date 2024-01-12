const { param, body } = require("express-validator");
const CategoryController = require("../../controllers/category");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { existCategory, validate } = require("../../middlewares/validation");

const router = require("express").Router();

router.post(
  "",
  body("name").notEmpty().withMessage("Name is missing"),
  body("parentId")
    .custom(existCategory)
    .withMessage("Parent category not found"),
  validate,
  asyncHandler(CategoryController.create)
);

router.get("", asyncHandler(CategoryController.getAll));

router.put(
  "/:id",
  param("id").custom(existCategory),
  validate,
  asyncHandler(CategoryController.update)
);

router.delete(
  "/:id",
  param("id").custom(existCategory),
  validate,
  asyncHandler(CategoryController.delete)
);

module.exports = router;
