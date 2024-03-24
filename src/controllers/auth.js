const { OKResponse, CreatedResponse } = require("../response/success");
const AccountService = require("../services/account");
const AuthService = require("../services/auth");

class AuthController {
  static async adminLogin(req, res) {
    new OKResponse({
      message: "Login successfully",
      metadata: await AuthService.adminLogin(req.body),
    }).send(res);
  }

  static async adminLoginWithGoogle(req, res) {
    new OKResponse({
      message: "Login with google successfully",
      metadata: await AuthService.adminLoginWithGoogle(req.body),
    }).send(res);
  }

  static async getLoggedInAccount(req, res) {
    new OKResponse({
      metadata: await AccountService.getOne(req.account.id),
    }).send(res);
  }

  static async updateRole(req, res) { }
}

module.exports = AuthController;
