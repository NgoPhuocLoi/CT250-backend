const prisma = require("../config/prismaClient");

class ProductService {
  static async create({ name, price, description, overview, material, instruction, slug, categoryId }) {
    return await prisma.product.create({
      data: {
        name, price, description, overview, material, instruction, slug, categoryId
      },
    });
  }

  static async getAll() {
    return await prisma.product.findMany({
      include: {
        image: {
          select: {
            url: true,
          }
        },
        variant: {
          select: {
            id: true,
            color: true,
            size: true,
          },
        }
      },
    });
  }

  static async getOne(productId) {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        image: {
          select: {
            url: true,
          }
        },
        variant: {
          select: {
            id: true,
            color: true,
            size: true,
          },
        }
      },
    })
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
          }
        },
        variant: {
          select: {
            id: true,
            color: true,
            size: true,
          },
        }
      },
    })
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
}

module.exports = ProductService;
