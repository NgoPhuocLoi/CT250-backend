const slugify = require("slugify");
const prisma = require("../config/prismaClient");
const UploadService = require("./upload");
const { PRODUCT_ALL } = require("../constant/productType");

class ProductService {
  static async create({ images, ...data }) {
    const newProduct = await prisma.product.create({
      data: {
        ...data,
        slug: slugify(data.name + "-" + new Date().getTime(), {
          lower: true,
        }),
      },
    });

    await prisma.productImage.createMany({
      data: images.map((image) => ({ ...image, productId: newProduct.id })),
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
        images: true,
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
    return products.map((product) => ({
      ...product,
      colors: [
        ...new Map(product.variants.map((v) => [v.color.id, v.color])).values(),
      ],
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
    const foundProduct = await prisma.product.findUnique({
      where: {
        slug: productSlug,
      },
      include: {
        images: true,
        variants: true,
      },
    });
    const [productColors, productSizes] = await Promise.all([
      prisma.variant.findMany({
        distinct: ["colorId"],
        where: {
          productId: foundProduct.id,
        },
        select: {
          color: true,
        },
      }),
      prisma.variant.findMany({
        distinct: ["sizeId"],
        where: {
          productId: foundProduct.id,
        },
        select: {
          size: true,
        },
      }),
    ]);

    foundProduct.sizes = productSizes.map((item) => item.size);
    foundProduct.colors = productColors.map((item) => item.color);

    return foundProduct;
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
      product.images.map((image) => UploadService.destroyImage(image.filename))
    );

    await prisma.product.delete({ where: { id: productId } });
  }

  static async addImage(productId, { path, filename }) {
    return await prisma.productImage.create({
      data: {
        productId,
        path,
        filename,
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
      UploadService.destroyImage(filename),
    ]);
  }
}

module.exports = ProductService;
