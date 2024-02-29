const { CreatedResponse } = require("../response/success");

class OrderController {
  static async create(req, res) {
    new CreatedResponse({
      metadata: "CREATE",
    });
  }
}

module.exports = OrderController;
