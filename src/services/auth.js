const prisma = require("../config/prismaClient");
const bcrypt = require("bcrypt");
const { BadRequest } = require("../response/error");
const { generatePairTokens } = require("../utils/generateToken");
const { getRole } = require("../constant/roles");

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

  static async login({ email, password }) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          select: { role: true },
        },
      },
    });

    if (!user) throw new BadRequest("Invalid credentials");

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword) throw new BadRequest("Invalid credentials");

    const tokens = generatePairTokens({
      userId: user.id,
      role: getRole(user.roleId),
    });

    return {
      user: {
        ...user,
        password: undefined,
        role: user.role.role,
        roleId: undefined,
      },
      tokens,
    };
  }
}

module.exports = AuthService;
