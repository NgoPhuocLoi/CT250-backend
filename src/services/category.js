const prisma = require("../config/prismaClient");

class CategoryService {
  static async create({ name, parentId }) {
    return await prisma.category.create({
      data: {
        name,
        parentId,
      },
    });
  }

  static async getAll() {
    return await prisma.category.findMany();
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
