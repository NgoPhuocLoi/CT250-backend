const { CreatedResponse } = require("../response/success");
const CouponService = require("../services/coupon");

class CouponController {
  static async createCoupon(req, res) {
    new CreatedResponse({
      message: "Coupon created successfully",
      metadata: await CouponService.create(req.body),
    }).send(res);
  }
}

module.exports = CouponController;
