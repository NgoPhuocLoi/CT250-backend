const prisma = require("../config/prismaClient");

class ProductImageService {
  static async create({ url, productId }) {
    return await prisma.productImage.create({
      data: {
        url, productId
      },
    });
  }

  static async getAll() {
    return await prisma.productImage.findMany({});
  }

  static async getOne(productImageId) {
    const product = await prisma.productImage.findUnique({
      where: {
        id: productImageId,
      },
    })
    return product;
  }

  static async update(productImageId, updatedData) {
    return await prisma.productImage.update({
      where: {
        id: productImageId,
      },
      data: updatedData,
    });
  }

  static async delete(productImageId) {
    await prisma.productImage.delete({ where: { id: productImageId } });
  }
}

module.exports = ProductImageService;
