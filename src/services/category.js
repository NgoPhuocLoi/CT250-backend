const prisma = require("../config/prismaClient");

class CategoryService {
  static async create({ name, parentId, slug }) {
    return await prisma.category.create({
      data: {
        name,
        parentId,
        slug,
      },
    });
  }

  static async getAll() {
    return await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true,
          },
          orderBy: {
            children: {
              _count: "desc",
            },
          },
        },
      },
    });
  }

  static async getCategoriesRecursivelyFromParent(parentCategoryId) {
    let result = [];
    let index = 0;
    while (parentCategoryId) {
      const categoryIds = await prisma.category.findMany({
        where: {
          parentId: parentCategoryId,
        },
        select: {
          id: true,
        },
      });

      categoryIds.forEach((category) => result.push(category.id));
      parentCategoryId = result[index++];
    }
    return result;
  }

  static async update(categoryId, updatedData) {
    return await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: updatedData,
    });
  }

  static async delete(categoryId) {
    await prisma.category.delete({ where: { id: categoryId } });
  }
}

module.exports = CategoryService;
