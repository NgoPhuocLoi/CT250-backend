const { CreatedResponse } = require("../response/success");
const AddressService = require("../services/address");

class AddressController {
  static async create(req, res) {
    console.log(req.account.id);
    console.log(req.body);
    // new CreatedResponse({
    //   metadata: await AddressService.create(req.account.id, req.body)
    // });
    res.send("OK");
  }

  static async getAll(req, res) {
    return res.json("GET ALL");
  }

  static async update(req, res) {
    return res.json("UPDATE");
  }

  static async delete(req, res) {
    return res.json("DELETE");
  }
}

module.exports = AddressController;
