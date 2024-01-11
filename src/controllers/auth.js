const { OKResponse } = require("../response/success");

class AuthController {
  static register(req, res) {
    new OKResponse({
      message: "REGISTER",
    }).send(res);
  }

  static login(req, res) {
    new OKResponse({
      message: "LOGIN",
    }).send(res);
  }
}

module.exports = AuthController;
