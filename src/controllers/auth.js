const { OKResponse } = require("../response/success");
const AuthService = require("../services/auth");

class AuthController {
  static async register(req, res) {
    new OKResponse({
      message: "Register successfully",
      metadata: await AuthService.register(req.body),
    }).send(res);
  }

  static login(req, res) {
    new OKResponse({
      message: "LOGIN",
    }).send(res);
  }
}

module.exports = AuthController;
