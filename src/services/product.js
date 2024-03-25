const slugify = require("slugify");
const prisma = require("../config/prismaClient");
const UploadService = require("./upload");
const {
  PRODUCT_ALL,
  PRODUCT_NEWEST,
  PRODUCT_TRENDING,
  PRODUCT_SALES,
} = require("../constant/productType");
const CategoryService = require("./category");
const { generateEmbeddingsFrom } = require("../utils/generateEmbeddings");
const { getGenderFromQuery } = require("../utils");
const { Prisma } = require("@prisma/client");

class ProductService {
  static async create({ uploadedImageIds, ...data }) {
    const newProduct = await prisma.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: {
          ...data,
          slug: slugify(
            data.name + "-" + new Date().getTime() + "-" + Math.random(),
            {
              lower: true,
            }
          ),
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

  static async getAll({
    type = PRODUCT_ALL,
    limit = 6,
    categoryIds = [],
    productIds = [],
  }) {
    const query = {
      include: {
        images: {
          include: {
            image: true,
          },
        },
        colors: {
          include: {
            thumbnailImage: true,
            productImage: {
              include: {
                image: true,
              },
            },
          },
        },
        variants: {
          select: {
            quantity: true,
          },
        },
        productDiscount: {
          where: {
            startDate: {
              lte: new Date().toISOString(),
            },
            endDate: {
              gte: new Date().toISOString(),
            },
          },
        },
      },
      take: limit,
    };

    if (categoryIds.length > 0) {
      const res = await Promise.all(
        categoryIds.map((categoryId) =>
          CategoryService.getCategoriesRecursivelyFromParent(+categoryId)
        )
      );
      const recursiveCategoryIds = Array.from(new Set(res.flat()));
      query.where = {
        categoryId: {
          in: recursiveCategoryIds,
        },
      };
    }

    if (productIds.length > 0) {
      if (query.where) {
        query.where.id = {
          in: productIds.map((id) => +id),
        };
      } else {
        query.where = {
          id: {
            in: productIds.map((id) => +id),
          },
        };
      }

      query.include.variants = true;
    }

    if (type === PRODUCT_NEWEST) {
      query.orderBy = {
        createdAt: "desc",
      };
    }

    if (type === PRODUCT_TRENDING) {
      query.orderBy = {
        soldNumber: "desc",
      };
    }

    if (type === PRODUCT_SALES) {
      if (!query.where) Object.assign(query, { where: {} });
      query.where.productDiscount = {
        some: {
          startDate: {
            lte: new Date().toISOString(),
          },
          endDate: {
            gte: new Date().toISOString(),
          },
        },
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
              color: {
                select: {
                  id: true,
                },
              },
            },
          },
          variants: {
            include: {
              color: {
                include: {
                  productImage: {
                    include: {
                      image: {
                        select: {
                          path: true,
                        },
                      },
                    },
                  },
                  thumbnailImage: {
                    select: {
                      path: true,
                    },
                  },
                },
              },
              size: true,
            },
          },
          colors: {
            include: {
              thumbnailImage: true,
            },
          },
          productDiscount: {
            where: {
              startDate: {
                lte: new Date().toISOString(),
              },
              endDate: {
                gte: new Date().toISOString(),
              },
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

    product.sizes = productSizes
      .map((item) => item.size)
      .sort((a, b) => b.id - a.id);

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
            color: {
              select: {
                id: true,
              },
            },
          },
        },
        variants: true,
        colors: {
          include: {
            thumbnailImage: true,
          },
        },
        productDiscount: {
          where: {
            startDate: {
              lte: new Date().toISOString(),
            },
            endDate: {
              gte: new Date().toISOString(),
            },
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

    product.sizes = productSizes
      .map((item) => item.size)
      .sort((a, b) => a.id - b.id);

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

  static async addImage(productId, { uploadedImageId }) {
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

  static async semanticSeach(query) {
    const embeddings = await generateEmbeddingsFrom(query.toLowerCase());
    const genderObject = await getGenderFromQuery(query);

    let result;

    if (genderObject) {
      const categoriesRecursivelyFromParent = Array.from(
        new Set(
          await CategoryService.getCategoriesRecursivelyFromParent(
            genderObject.id
          )
        )
      );
      console.log(categoriesRecursivelyFromParent);
      result =
        await prisma.$queryRaw`SELECT 1 - (embedding <=> ${embeddings}::vector) AS cosine_similarity, products.product_id FROM product_embeddings JOIN products ON product_embeddings.product_id = products.product_id  WHERE 1 - (embedding <=> ${embeddings}::vector) >= 0.76 AND products.category_id IN (${Prisma.join(
          categoriesRecursivelyFromParent
        )}) ORDER BY cosine_similarity DESC LIMIT 10;`;

      console.log(result);
    } else {
      result =
        await prisma.$queryRaw`SELECT 1 - (embedding <=> ${embeddings}::vector) AS cosine_similarity, product_id FROM product_embeddings WHERE 1 - (embedding <=> ${embeddings}::vector) >= 0.7 ORDER BY cosine_similarity DESC LIMIT 10;`;
    }

    return await prisma.product.findMany({
      where: {
        id: {
          in: result.map((item) => item.product_id),
        },
      },
      include: {
        images: {
          include: {
            image: true,
          },
        },
        colors: {
          include: {
            thumbnailImage: true,
            productImage: {
              include: {
                image: true,
              },
            },
          },
        },
        variants: {
          select: {
            quantity: true,
          },
        },
        productDiscount: {
          where: {
            startDate: {
              lte: new Date().toISOString(),
            },
            endDate: {
              gte: new Date().toISOString(),
            },
          },
        },
      },
    });
  }
}

module.exports = ProductService;
