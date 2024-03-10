const prisma = require("../config/prismaClient");

class CouponService {
  static async create({
    code,
    discountType,
    discountValue,
    startDate,
    endDate,
    maxUse,
    minimumPriceToUse,
  }) {
    const newCoupon = await prisma.coupon.create({
      data: {
        code,
        discountType,
        discountValue: +discountValue,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        maxUse: +maxUse,
        minimumPriceToUse: +minimumPriceToUse,
      },
    });

    return newCoupon;
  }
}

module.exports = CouponService;
