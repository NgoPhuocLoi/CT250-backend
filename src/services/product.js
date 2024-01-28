const slugify = require("slugify");
const prisma = require("../config/prismaClient");

class ProductService {
  static async create(data) {
    return await prisma.product.create({
      data: {
        ...data,
        slug: slugify(data.name + "-" + new Date().getTime(), {
          lower: true,
        }),
      },
    });
  }

  static async getAll() {
    return await prisma.product.findMany({});
  }

  static async getOne(productId) {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        image: true,
      },
    });
    return product;
  }

  static async getOneBySlug(productSlug) {
    const product = await prisma.product.findUnique({
      where: {
        slug: productSlug,
      },
      include: {
        image: {
          select: {
            url: true,
          },
        },
        variant: {
          select: {
            id: true,
            color: true,
            size: true,
          },
        },
      },
    });
    return product;
  }

  static async update(productId, updatedData) {
    return await prisma.product.update({
      where: {
        id: productId,
      },
      data: updatedData,
    });
  }

  static async delete(productId) {
    await prisma.product.delete({ where: { id: productId } });
  }

  static async addImage(productId, imageUrl) {
    return await prisma.productImage.create({
      data: {
        productId,
        url: imageUrl,
      },
    });
  }

  static async deleteImage(productImageId) {
    await prisma.productImage.delete({
      where: {
        id: productImageId,
      },
    });
  }
}

module.exports = ProductService;
