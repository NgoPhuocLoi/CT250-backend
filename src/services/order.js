const prisma = require("../config/prismaClient");

class OrderService {
  static async create() {}

  static async getAllOrderStatus() {
    return await prisma.orderStatus.findMany();
  }
}

module.exports = OrderService;
