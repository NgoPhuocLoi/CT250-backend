const prisma = require("../config/prismaClient");
const { BadRequest } = require("../response/error");

class CouponService {
  static async create({
    code,
    discountType,
    discountValue,
    startDate,
    endDate,
    quantity,
    minimumPriceToUse,
  }) {
    const newCoupon = await prisma.coupon.create({
      data: {
        code,
        discountType,
        discountValue: +discountValue,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        quantity: +quantity,
        minimumPriceToUse: +minimumPriceToUse,
      },
    });

    return newCoupon;
  }

  static async update(couponId, data) {
    return await prisma.coupon.update({
      where: {
        id: couponId,
      },
      data,
    });
  }

  static async getAll() {
    return await prisma.coupon.findMany();
  }

  static async getValidCoupons() {
    return await prisma.coupon.findMany({
      where: {
        visible: true,
        endDate: {
          gte: new Date().toISOString(),
        },
      },
    });
  }

  static async collectCoupon(accountId, couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: {
        code: couponCode,
      },
    });

    if (coupon.collectedQuantity === coupon.quantity) {
      throw new BadRequest("Coupon is ran out of stock");
    }

    if (!coupon) {
      throw new BadRequest("Coupon not found");
    }

    const foundCollectedCoupon = await prisma.collectedCoupons.findUnique({
      where: {
        accountId_couponId: {
          accountId,
          couponId: coupon.id,
        },
      },
    });

    if (foundCollectedCoupon) {
      throw new BadRequest("Coupon already collected");
    }

    return await prisma.$transaction(async (tx) => {
      const collectedCoupon = await tx.collectedCoupons.create({
        data: {
          accountId,
          couponId: coupon.id,
        },
      });

      await tx.coupon.update({
        where: {
          id: coupon.id,
        },
        data: {
          collectedQuantity: {
            increment: 1,
          },
        },
      });

      return collectedCoupon;
    });
  }

  static async getCollectedCoupons(accountId) {
    return await prisma.collectedCoupons.findMany({
      where: {
        accountId,
      },
      include: {
        coupon: true,
      },
    });
  }
}

module.exports = CouponService;
