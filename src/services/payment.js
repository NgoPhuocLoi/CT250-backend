const prisma = require("../config/prismaClient");

class PaymentService {
  static async getPaymentMethods() {
    return await prisma.paymentMethod.findMany();
  }
}

module.exports = PaymentService;
