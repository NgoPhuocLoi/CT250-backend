const prisma = require("../config/prismaClient");
const { CreatedResponse, OKResponse } = require("../response/success");
const ProductService = require("../services/product");
const ProductDiscountService = require("../services/productDiscount");
const pgVector = require("../config/pgVector");
const { generateEmbeddingsFrom } = require("../utils/generateEmbeddings");

class ProductController {
  static async create(req, res) {
    new CreatedResponse({
      metadata: await ProductService.create(req.body),
    }).send(res);
  }

  static async getAll(req, res) {
    new OKResponse({
      metadata: await ProductService.getAll({
        type: req.query.type,
        categoryIds: req.query.categoryIds,
        limit: +req.query.limit,
        productIds: req.query.productIds,
      }),
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

  static async createDiscount(req, res) {
    new CreatedResponse({
      message: "Product discount created",
      metadata: await ProductDiscountService.create({
        ...req.body,
        productId: +req.params.id,
      }),
    }).send(res);
  }

  static async search(req, res) {
    const query = req.query.q;
    const searchQuery = query.split(" ").join(" & ");
    const genderRegex = /(nam|nữ|trẻ em)/i;
    // const gender = query.match(regex)[0];
    // console.log(gender);
    console.log(searchQuery);
    const results = await prisma.product.findMany({
      where: {
        name: {
          search: searchQuery,
        },
      },
    });
    new OKResponse({
      metadata: results,
    }).send(res);
  }

  static async semanticSearch(req, res) {
    const query = req.query.q;
    console.log(query);

    new OKResponse({
      metadata: await ProductService.semanticSeach(query),
    }).send(res);
  }
}

module.exports = ProductController;
