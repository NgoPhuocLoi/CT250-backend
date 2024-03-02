const OrderController = require("../../controllers/order");
const { asyncHandler } = require("../../middlewares/asyncHandler");

const router = require("express").Router();

router.post("", asyncHandler(OrderController.create));
router.get("/status-all", asyncHandler(OrderController.getAllOrderStatus));

module.exports = router;
