const prisma = require("../config/prismaClient");
const { BadRequest } = require("../response/error");

class AccountService {
    static async getAll() {
        const accounts = await prisma.account.findMany();
        return accounts;
    }

    static async getOne(accountId) {
        const account = await prisma.account.findUnique({
            where: {
                id: accountId,
            },
        })
        return account;
    }

    static async deleteAll() {
        const deletedAccount = await prisma.account.deleteMany();
        return deletedAccount;
    }

}

module.exports = AccountService;
