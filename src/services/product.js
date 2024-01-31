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
    const products = await prisma.product.findMany({
      include: {
        variants: {
          distinct: "colorId",
          select: {
            color: true,
          },
        },
      },
    });
    return products.map((product) => ({
      ...product,
      colors: product.variants.map((v) => v.color),
      variants: undefined,
    }));
  }

  static async getOne(productId) {
    const [product, productColors, productSizes] = await Promise.all([
      prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          images: true,
          variants: true,
        },
      }),
      prisma.variant.findMany({
        distinct: ["colorId"],
        where: {
          productId,
        },
        select: {
          color: true,
        },
      }),
      prisma.variant.findMany({
        distinct: ["sizeId"],
        where: {
          productId,
        },
        select: {
          size: true,
        },
      }),
    ]);

    product.sizes = productSizes.map((item) => item.size);
    product.colors = productColors.map((item) => item.color);

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
