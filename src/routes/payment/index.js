const PaymentController = require("../../controllers/payment");
const { asyncHandler } = require("../../middlewares/asyncHandler");

const router = require("express").Router();

router.get("/methods", asyncHandler(PaymentController.getPaymentMethods));

module.exports = router;
