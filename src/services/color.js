const prisma = require("../config/prismaClient");

class ColorService {
  static async create({ name, color_thumbnail, color_image }) {
    return await prisma.color.create({
      data: {
        name, color_thumbnail, color_image
      },
    });
  }

  static async getAll() {
    return await prisma.color.findMany({});
  }

  static async getOne(colorId) {
    const color = await prisma.color.findUnique({
      where: {
        id: colorId,
      },
    });
    return color;
  }

  static async update(colorId, updatedData) {
    return await prisma.color.update({
      where: {
        id: colorId,
      },
      data: updatedData,
    });
  }

  static async delete(colorId) {
    await prisma.color.delete({ where: { id: colorId } });
  }
}

module.exports = ColorService;
