const { body } = require("express-validator");
const AddressController = require("../../controllers/address");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");
const { validate, existProvince } = require("../../middlewares/validation");

const router = require("express").Router();

router.use(authentication);

router.get("/current-account", asyncHandler(AddressController.getAll));
router.post(
  "/",
  body("provinceId")
    .notEmpty()
    .withMessage("Province ID is missing")
    .custom(existProvince),
  validate,
  asyncHandler(AddressController.create)
);
router.put("/:addressId", asyncHandler(AddressController.update));
router.delete("/:addressId", asyncHandler(AddressController.delete));

module.exports = router;
