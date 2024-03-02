const { CreatedResponse, OKResponse } = require("../response/success");
const OrderService = require("../services/order");

class OrderController {
  static async create(req, res) {
    new CreatedResponse({
      metadata: "CREATE",
    }).send(res);
  }

  static async getAllOrderStatus(req, res) {
    new OKResponse({
      metadata: await OrderService.getAllOrderStatus(),
    }).send(res);
  }
}

module.exports = OrderController;
