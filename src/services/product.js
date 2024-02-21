const slugify = require("slugify");
const prisma = require("../config/prismaClient");
const UploadService = require("./upload");
const { PRODUCT_ALL } = require("../constant/productType");

class ProductService {
  static async create({ uploadedImageIds, ...data }) {
    const newProduct = await prisma.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: {
          ...data,
          slug: slugify(data.name + "-" + new Date().getTime(), {
            lower: true,
          }),
        },
      });

      await tx.productImage.createMany({
        data: uploadedImageIds.map((uploadedImageId) => ({
          imageId: uploadedImageId,
          productId: createdProduct.id,
        })),
      });
      return createdProduct;
    });

    return newProduct;
  }

  static async getAll({ type = PRODUCT_ALL, limit = 6, categoryIds = [] }) {
    const query = {
      include: {
        variants: {
          include: {
            color: true,
          },
        },
        images: {
          include: {
            image: true,
          },
        },
        colors: {
          include: {
            thumbnailImage: true,
          },
        },
      },
      take: limit,
    };

    if (categoryIds.length > 0) {
      query.where = {
        categoryId: {
          in: categoryIds.map((id) => +id),
        },
      };
    }

    if (type !== PRODUCT_ALL) {
      query.orderBy = {
        createdAt: "desc",
      };
    }
    const products = await prisma.product.findMany(query);
    return products;
  }

  static async getOne(productId) {
    const [product, productSizes] = await Promise.all([
      prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          images: {
            include: {
              image: true,
            },
          },
          variants: true,
          colors: {
            include: {
              thumbnailImage: true,
            },
          },
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

    return product;
  }

  static async getOneBySlug(productSlug) {
    const product = await prisma.product.findUnique({
      where: {
        slug: productSlug,
      },
      include: {
        images: {
          include: {
            image: true,
          },
        },
        variants: true,
        colors: {
          include: {
            thumbnailImage: true,
          },
        },
      },
    });

    const productSizes = await prisma.variant.findMany({
      distinct: ["sizeId"],
      where: {
        productId: product.id,
      },
      select: {
        size: true,
      },
    });

    product.sizes = productSizes.map((item) => item.size);

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
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
      },
    });

    await Promise.all(
      product.images.map((image) => UploadService.destroyImage(image.imageId))
    );

    await prisma.product.delete({ where: { id: productId } });
  }

  static async addImage(productId, uploadedImageId) {
    return await prisma.productImage.create({
      data: {
        productId,
        imageId: uploadedImageId,
      },
    });
  }

  static async deleteImage(productImageId, filename) {
    await Promise.all([
      prisma.productImage.delete({
        where: {
          id: productImageId,
        },
      }),
      UploadService.destroyImage(productImageId),
    ]);
  }
}

module.exports = ProductService;
