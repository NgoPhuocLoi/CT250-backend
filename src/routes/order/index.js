const { body, query, param } = require("express-validator");
const OrderController = require("../../controllers/order");
const { asyncHandler } = require("../../middlewares/asyncHandler");
const { authentication } = require("../../middlewares/auth");
const {
  validate,
  existAddressOfAccount,
  existOrderOfAccount,
} = require("../../middlewares/validation");

const router = require("express").Router();

router.get("", asyncHandler(OrderController.getAll));

router.get("/status-all", asyncHandler(OrderController.getAllOrderStatus));

router.get(
  "/:orderId",
  param("orderId").custom(existOrderOfAccount),
  validate,
  asyncHandler(OrderController.getById)
);

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
  body("paymentMethodId").notEmpty().withMessage("paymentMethodId is missing"),
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

router.put(
  "/:orderId",
  param("orderId").custom(existOrderOfAccount),
  validate,
  asyncHandler(OrderController.cancel)
);

module.exports = router;
