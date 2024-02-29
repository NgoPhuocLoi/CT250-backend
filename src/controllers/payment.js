const { OKResponse } = require("../response/success");
const PaymentService = require("../services/payment");

class PaymentController {
  static async getPaymentMethods(req, res) {
    new OKResponse({
      metadata: await PaymentService.getPaymentMethods(),
    }).send(res);
  }
}

module.exports = PaymentController;
