const prisma = require("../config/prismaClient");
const bcrypt = require("bcrypt");

class AuthService {
  static async register({ email, password, fullName }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
      },
    });

    return newUser;
  }

  static login() {}
}

module.exports = AuthService;
