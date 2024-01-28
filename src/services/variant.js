const prisma = require("../config/prismaClient");

class VariantService {
  static async create({ quantity, colorId, sizeId, productId }) {
    return await prisma.variant.create({
      data: {
        quantity, colorId, sizeId, productId
      },
    });
  }

  static async getAll() {
    return await prisma.variant.findMany({
      include: {
        color: true,
        size: true,
        product: true,
      },
    });
  }

  static async getOne(variantId) {
    const variant = await prisma.variant.findUnique({
      where: {
        id: variantId,
      },
      include: {
        color: true,
        size: true,
        product: true,
      },
    });
    return variant;
  }

  static async update(variantId, updatedData) {
    return await prisma.variant.update({
      where: {
        id: variantId,
      },
      data: updatedData,
    });
  }

  static async delete(variantId) {
    await prisma.variant.delete({ where: { id: variantId } });
  }
}

module.exports = VariantService;
