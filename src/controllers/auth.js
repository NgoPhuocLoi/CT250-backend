const { OKResponse, CreatedResponse } = require("../response/success");
const AuthService = require("../services/auth");

class AuthController {
  static async register(req, res) {
    new CreatedResponse({
      message: "Register successfully",
      metadata: await AuthService.register(req.body),
    }).send(res);
  }

  static async login(req, res) {
    new OKResponse({
      message: "Login successfully",
      metadata: await AuthService.login(req.body),
    }).send(res);
  }

  static async updateRole(req, res) {}
}

module.exports = AuthController;
