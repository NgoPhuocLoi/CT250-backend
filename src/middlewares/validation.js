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

const existProductImage = async (productImageId, { req }) => {
  if (!productImageId) return true;
  if (!Number.parseInt(productImageId))
    throw new BadRequest("Product image not found");
  const foundProductImage = await prisma.productImage.findUnique({
    where: { id: +productImageId },
  });
  if (!foundProductImage) throw new BadRequest("Product image not found");
};

const existUploadedImage = async (uploadedImageId) => {
  if (!uploadedImageId) return true;
  if (!Number.parseInt(uploadedImageId))
    throw new BadRequest("Uploaded image not found");
  const foundImage = await prisma.uploadedImage.findUnique({
    where: { id: +uploadedImageId },
  });
  if (!foundImage) throw new BadRequest("Uploaded image not found");
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

const existProvince = async (provinceId, { req }) => {
  if (!provinceId) return true;
  const res = await fetch(`${process.env.GHN_BASE_API_URL}/province`, {
    method: "GET",
    headers: {
      Token: process.env.GHN_TOKEN_API,
    },
  });

  const provinces = (await res.json()).data;

  const foundProvince = provinces.find(
    (province) => province.ProvinceID === provinceId
  );

  if (!foundProvince) throw new BadRequest("Province not found");

  req.body.provinceName = foundProvince.ProvinceName;
};

const existDistrictOfProvince = async (districtId, { req }) => {
  if (!districtId || !req.body.provinceId) return true;
  const res = await fetch(
    `${process.env.GHN_BASE_API_URL}/district?province_id=${req.body.provinceId}`,
    {
      method: "GET",
      headers: {
        Token: process.env.GHN_TOKEN_API,
      },
    }
  );

  const districts = (await res.json()).data;

  const foundDistrict = districts.find(
    (district) => district.DistrictID === districtId
  );

  if (!foundDistrict) throw new BadRequest("District not found");

  req.body.districtName = foundDistrict.DistrictName;
};

const existWardOfDistrict = async (wardCode, { req }) => {
  if (!wardCode || !req.body.districtId) return true;
  const res = await fetch(
    `${process.env.GHN_BASE_API_URL}/ward?district_id=${req.body.districtId}`,
    {
      method: "GET",
      headers: {
        Token: process.env.GHN_TOKEN_API,
      },
    }
  );

  const wards = (await res.json()).data;

  console.log(wards);

  const foundWard = wards.find((ward) => ward.WardCode === wardCode);

  if (!foundWard) throw new BadRequest("Ward not found");

  req.body.wardName = foundWard.WardName;
};

const existAddressOfAccount = async (addressId, { req }) => {
  if (!addressId) return true;

  const foundAddress = await prisma.address.findFirst({
    where: {
      id: +addressId,
      accountId: +req.account.id,
    },
  });

  if (!foundAddress) throw new BadRequest("Address not found");
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
  existUploadedImage,
  existProvince,
  existDistrictOfProvince,
  existWardOfDistrict,
  existAddressOfAccount,
};
