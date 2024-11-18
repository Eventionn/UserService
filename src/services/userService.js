const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async getAllUsers() {
    return prisma.user.findMany(); 
  },

  async createUser(userData) {
    return prisma.user.create({
      data: userData,
    });
  },
};