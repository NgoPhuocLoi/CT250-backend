const { CreatedResponse, OKResponse } = require("../response/success");
const VariantService = require("../services/variant");

class VariantController {
  static async create(req, res) {
    new CreatedResponse({
      metadata: await VariantService.create(req.body),
    }).send(res);
  }

  static async getAll(req, res) {
    new OKResponse({
      metadata: await VariantService.getAll(),
    }).send(res);
  }

  static async getOne(req, res) {
    new OKResponse({
      metadata: await VariantService.getOne(+req.params.id),
    }).send(res);
  }

  static async update(req, res) {
    new OKResponse({
      metadata: await VariantService.update(+req.params.id, req.body),
    }).send(res);
  }

  static async delete(req, res) {
    new OKResponse({
      metadata: await VariantService.delete(+req.params.id),
    }).send(res);
  }
}

module.exports = VariantController;
