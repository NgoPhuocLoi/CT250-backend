const prisma = require("../config/prismaClient");

class AddressService {
  static async create(
    accountId,
    {
      provinceId,
      districtId,
      wardCode,
      provinceName,
      districtName,
      wardName,
      contactName,
      contactPhone,
      isDefault,
      detailAddress = "",
    }
  ) {
    const newAddress = await prisma.address.create({
      data: {
        accountId,
        provinceId,
        districtId,
        wardCode,
        provinceName,
        districtName,
        wardName,
        contactName,
        contactPhone,
        isDefault,
        detailAddress,
      },
    });

    return newAddress;
  }
}

module.exports = AddressService;
