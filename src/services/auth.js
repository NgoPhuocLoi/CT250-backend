const prisma = require("../config/prismaClient");
const bcrypt = require("bcrypt");
const { BadRequest } = require("../response/error");
const { generatePairTokens } = require("../utils/generateToken");
const { getRole } = require("../constant/roles");

class AuthService {
  static async register({ fullName, email, password, phone, gender, birthday }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAccount = await prisma.account.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        phone, 
        gender,
        birthday,
      },
    });
    return newAccount;
  }

  static async login({ email, password }) {
    const account = await prisma.account.findUnique({
      where: { email },
      include: {
        role: {
          select: { role: true },
        },
      },
    });

    if (!account) throw new BadRequest("Invalid credentials");

    const matchedPassword = await bcrypt.compare(password, account.password);

    if (!matchedPassword) throw new BadRequest("Invalid credentials");

    const tokens = generatePairTokens({
      id: account.id,
      role: getRole(account.roleId),
    });

    return {
      account: {
        ...account,
        password: undefined,
        role: account.role.role,
        roleId: undefined,
      },
      tokens,
    };
  }
}

module.exports = AuthService;
