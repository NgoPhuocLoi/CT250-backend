const GiaoHangNhanhService = require("./ghn");

class ShippingService {
  static async calculateFee({ toDistrictId, toWardCode, weightInGram }) {
    const DEFAULT_SERVICE_ID = 53320;
    const shopInfo = (await GiaoHangNhanhService.getStoreInformation())
      .shops[0];

    const orderFee = await GiaoHangNhanhService.calculateOrderFee(
      shopInfo._id,
      {
        serviceId: DEFAULT_SERVICE_ID,
        fromDistrictId: shopInfo.district_id,
        fromWardCode: shopInfo.ward_code,
        toDistrictId,
        toWardCode,
        weightInGram,
      }
    );

    return orderFee.data;
  }
}

module.exports = ShippingService;
