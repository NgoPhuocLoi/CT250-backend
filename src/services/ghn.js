class GiaoHangNhanhService {
  static async getProvinces() {
    const res = await fetch(`${process.env.GHN_BASE_API_URL}/province`, {
      method: "GET",
      headers: {
        Token: process.env.GHN_TOKEN_API,
      },
    });

    return (await res.json()).data;
  }

  static async getDistrictsByProvinceId(provinceId) {
    const res = await fetch(
      `${process.env.GHN_BASE_API_URL}/district?province_id=${provinceId}`,
      {
        method: "GET",
        headers: {
          Token: process.env.GHN_TOKEN_API,
        },
      }
    );

    return (await res.json()).data;
  }

  static async getWardsByDistrictId(districtId) {
    const res = await fetch(
      `${process.env.GHN_BASE_API_URL}/ward?district_id=${districtId}`,
      {
        method: "GET",
        headers: {
          Token: process.env.GHN_TOKEN_API,
        },
      }
    );

    return (await res.json()).data;
  }
}

module.exports = GiaoHangNhanhService;
