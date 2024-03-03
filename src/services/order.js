const prisma = require("../config/prismaClient");
const { ORDER_STATUS_ID_MAPPING } = require("../constant/orderStatus");
const { BadRequest } = require("../response/error");

class OrderService {
  static async create({
    totalPrice,
    totalDiscount,
    finalPrice,
    shippingFee,
    buyerId,
    deliveryAddressId,
    items = [],
  }) {
    await this.validateOrder({
      totalPrice,
      totalDiscount,
      finalPrice,
      shippingFee,
      items,
    });
    return await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          totalPrice,
          totalDiscount,
          finalPrice,
          shippingFee,
          buyerId,
          deliveryAddressId,
          currentStatusId: ORDER_STATUS_ID_MAPPING.AWAITING_CONFIRM,
        },
      });

      await tx.orderDetail.createMany({
        data: items.map((item) => ({
          orderId: createdOrder.id,
          variantId: +item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      await tx.variant.updateMany({
        where: {
          id: {
            in: items.map((item) => +item.variantId),
          },
        },
        data: {
          quantity: {
            decrement: 1,
          },
        },
      });

      const productSoldNumberToUpDate = [];

      items.forEach((item) => {
        const foundProductIndex = productSoldNumberToUpDate.findIndex(
          (product) => product.productId === +item.productId
        );

        if (foundProductIndex < 0) {
          productSoldNumberToUpDate.push({
            productId: +item.productId,
            quantity: +item.quantity,
          });
        } else {
          productSoldNumberToUpDate[foundProductIndex].quantity +=
            +item.quantity;
        }
      });

      await Promise.all(
        productSoldNumberToUpDate.map((product) =>
          tx.product.update({
            where: {
              id: product.productId,
            },
            data: {
              soldNumber: {
                increment: product.quantity,
              },
            },
          })
        )
      );

      return createdOrder;
    });
  }

  static async getOrdersOfBuyerByOrderStatus({ buyerId, orderStatusId }) {
    const query = {
      buyerId,
    };

    if (+orderStatusId != ORDER_STATUS_ID_MAPPING.ALL) {
      query.currentStatusId = orderStatusId;
    }

    return await prisma.order.findMany({
      where: query,
      include: {
        OrderDetail: true,
        currentStatus: true,
      },
    });
  }

  static async getAllOrderStatus() {
    return await prisma.orderStatus.findMany();
  }

  static async validateOrder({
    totalPrice,
    totalDiscount,
    shippingFee,
    finalPrice,
    items,
  }) {
    const quantityInOrder = Object.fromEntries(
      items.map((item) => [+item.variantId, item.quantity])
    );

    const variantsInDB = await prisma.variant.findMany({
      where: {
        id: {
          in: items.map((item) => +item.variantId),
        },
      },
      include: {
        product: {
          select: {
            price: true,
          },
        },
      },
    });

    const reCalculateTotalPrice = variantsInDB.reduce((prev, variant) => {
      if (variant.quantity < +quantityInOrder[variant.id]) {
        throw new BadRequest("Quantity of some item is invalid");
      }
      return prev + +quantityInOrder[variant.id] * +variant.product.price;
    }, 0);

    if (reCalculateTotalPrice != totalPrice) {
      throw new BadRequest("Total price is invalid");
    }

    if (finalPrice != totalPrice - totalDiscount + shippingFee) {
      throw new BadRequest("Final price is invalid");
    }
  }
}

module.exports = OrderService;
