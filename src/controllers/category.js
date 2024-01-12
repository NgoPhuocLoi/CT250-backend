const { CreatedResponse, OKResponse } = require("../response/success");
const CategoryService = require("../services/category");

class CategoryController {
  static async create(req, res) {
    new CreatedResponse({
      metadata: await CategoryService.create(req.body),
    }).send(res);
  }

  static async getAll(req, res) {
    new OKResponse({
      metadata: await CategoryService.getAll(),
    }).send(res);
  }

  static async update(req, res) {
    new OKResponse({
      metadata: await CategoryService.update(+req.params.id, req.body),
    }).send(res);
  }

  static async delete(req, res) {
    new OKResponse({
      metadata: await CategoryService.delete(+req.params.id),
    }).send(res);
  }
}

module.exports = CategoryController;
