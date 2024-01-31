const { validationResult } = require("express-validator");
const { BadRequest } = require("../response/error");
const prisma = require("../config/prismaClient");

const uniqueEmail = async (email) => {
  if (!email) return false;
  const foundAccount = await prisma.account.findUnique({
    where: {
      email,
    },
  });

  if (foundAccount) throw new BadRequest("This email has already been used!");
};

const existCategory = async (categoryId) => {
  if (!categoryId) return true;
  if (!Number.parseInt(categoryId)) throw new BadRequest("Category not found");
  const foundCategory = await prisma.category.findUnique({
    where: { id: +categoryId },
  });

  if (!foundCategory) throw new BadRequest("Category not found");
};

const existProduct = async (productId) => {
  if (!productId) return true;
  if (!Number.parseInt(productId)) throw new BadRequest("Product not found");
  const foundProduct = await prisma.product.findUnique({
    where: { id: +productId },
  });

  if (!foundProduct) throw new BadRequest("Product not found");
};

const existProductWithSlug = async (productSlug) => {
  if (!productSlug) return true;
  const foundProduct = await prisma.product.findUnique({
    where: { slug: productSlug },
  });

  if (!foundProduct) throw new BadRequest("Product not found");
};

const existProductImage = async (productImageId) => {
  if (!productImageId) return true;
  if (!Number.parseInt(productImageId))
    throw new BadRequest("Product image not found");
  const foundProductImage = await prisma.productImage.findUnique({
    where: { id: +productImageId },
  });

  if (!foundProductImage) throw new BadRequest("Product image not found");
};

const existColor = async (colorId) => {
  if (!colorId) return true;
  if (!Number.parseInt(colorId)) throw new BadRequest("Color not found");
  const foundColor = await prisma.color.findUnique({
    where: { id: +colorId },
  });

  if (!foundColor) throw new BadRequest("Color not found");
};

const existSize = async (sizeId) => {
  if (!sizeId) return true;
  if (!Number.parseInt(sizeId)) throw new BadRequest("Size not found");
  const foundSize = await prisma.size.findUnique({
    where: { id: +sizeId },
  });

  if (!foundSize) throw new BadRequest("Size not found");
};

const existVariant = async (productId, { req }) => {
  if (!req.body.sizeId || !req.body.colorId) return true;
  const foundVariant = await prisma.variant.findUnique({
    where: {
      productId_colorId_sizeId: {
        productId: +productId,
        colorId: +req.body.colorId,
        sizeId: +req.body.sizeId,
      },
    },
  });

  if (!foundVariant) throw new BadRequest("Variant not found");
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new BadRequest("Invalid input", errors.errors));
  }
  next();
};

module.exports = {
  validate,
  uniqueEmail,
  existCategory,
  existProduct,
  existProductWithSlug,
  existProductImage,
  existColor,
  existSize,
  existVariant,
};
