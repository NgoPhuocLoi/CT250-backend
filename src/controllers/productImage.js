const { CreatedResponse, OKResponse } = require("../response/success");
const ProductImageService = require("../services/productImage");

class ProductImageController {
  static async create(req, res) {
    new CreatedResponse({
      metadata: await ProductImageService.create(req.body),
    }).send(res);
  }

  static async getAll(req, res) {
    new OKResponse({
      metadata: await ProductImageService.getAll(),
    }).send(res);
  }

  static async getOne(req, res) {
    new OKResponse({
      metadata: await ProductImageService.getOne(+req.params.id),
    }).send(res);
  }

  static async update(req, res) {
    new OKResponse({
      metadata: await ProductImageService.update(+req.params.id, req.body),
    }).send(res);
  }

  static async delete(req, res) {
    new OKResponse({
      metadata: await ProductImageService.delete(+req.params.id),
    }).send(res);
  }
}

module.exports = ProductImageController;
