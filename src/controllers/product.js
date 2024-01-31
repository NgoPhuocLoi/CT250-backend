const { CreatedResponse, OKResponse } = require("../response/success");
const ProductService = require("../services/product");

class ProductController {
  static async create(req, res) {
    new CreatedResponse({
      metadata: await ProductService.create(req.body),
    }).send(res);
  }

  static async getAll(req, res) {
    new OKResponse({
      metadata: await ProductService.getAll(),
    }).send(res);
  }

  static async getOne(req, res) {
    new OKResponse({
      metadata: await ProductService.getOne(+req.params.id),
    }).send(res);
  }

  static async getOneBySlug(req, res) {
    new OKResponse({
      metadata: await ProductService.getOneBySlug(req.params.slug),
    }).send(res);
  }

  static async update(req, res) {
    new OKResponse({
      metadata: await ProductService.update(+req.params.id, req.body),
    }).send(res);
  }

  static async delete(req, res) {
    new OKResponse({
      metadata: await ProductService.delete(+req.params.id),
    }).send(res);
  }

  static async addImage(req, res) {
    new CreatedResponse({
      metadata: await ProductService.addImage(+req.params.id, req.body),
    }).send(res);
  }

  static async deleteImage(req, res) {
    new CreatedResponse({
      metadata: await ProductService.deleteImage(
        +req.params.imageId,
        req.filename
      ),
      // metadata: {},
    }).send(res);
  }
}

module.exports = ProductController;
