const prisma = require("../config/prismaClient");

class SizeService {
  static async create({ name, description }) {
    return await prisma.size.create({
      data: {
        name, description
      },
    });
  }

  static async getAll() {
    return await prisma.size.findMany({});
  }

  static async getOne(sizeId) {
    const size = await prisma.size.findUnique({
      where: {
        id: sizeId,
      },
    });
    return size;
  }

  static async update(sizeId, updatedData) {
    return await prisma.size.update({
      where: {
        id: sizeId,
      },
      data: updatedData,
    });
  }

  static async delete(sizeId) {
    await prisma.size.delete({ where: { id: sizeId } });
  }
}

module.exports = SizeService;
