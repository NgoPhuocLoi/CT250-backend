const { body, query } = require("express-validator");
const OrderController = require("../../controllers/order");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");
const {
  validate,
  existAddressOfAccount,
} = require("../../middlewares/validation");

const router = require("express").Router();

router.use(authentication);

router.post(
  "",
  body("totalPrice").notEmpty().withMessage("Total price is missing"),
  body("totalDiscount").notEmpty().withMessage("Total discount is missing"),
  body("finalPrice").notEmpty().withMessage("Final price is missing"),
  body("shippingFee").notEmpty().withMessage("Shipping fee is missing"),
  body("deliveryAddressId")
    .notEmpty()
    .withMessage("deliveryAddressId is missing")
    .custom(existAddressOfAccount),
  body("items")
    .notEmpty()
    .withMessage("Items is missing")
    .isArray()
    .withMessage("Items should be an array"),
  body("items.*.variantId")
    .notEmpty()
    .withMessage("Variant ID of item is missing"),
  body("items.*.productId")
    .notEmpty()
    .withMessage("Product ID of item is missing"),
  body("items.*.quantity")
    .notEmpty()
    .withMessage("Quantity of item is missing"),
  body("items.*.price").notEmpty().withMessage("Price of item is missing"),
  validate,
  asyncHandler(OrderController.create)
);

router.get(
  "/",
  query("orderStatusId").notEmpty().withMessage("Order status ID is mising"),
  validate,
  asyncHandler(OrderController.getOrdersOfBuyerByOrderStatus)
);

router.get("/status-all", asyncHandler(OrderController.getAllOrderStatus));

module.exports = router;
