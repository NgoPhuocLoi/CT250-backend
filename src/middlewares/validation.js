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

  if (foundAccount) throw new Error("This email has already been used!");
};

const existCategory = async (categoryId) => {
  if (!categoryId) return true;
  if (!Number.parseInt(categoryId)) throw new Error("Category not found");
  const foundCategory = await prisma.category.findUnique({
    where: { id: +categoryId },
  });

  if (!foundCategory) throw new Error("Category not found");
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new BadRequest("Invalid input", errors.errors));
  }
  next();
};

module.exports = { validate, uniqueEmail, existCategory };
