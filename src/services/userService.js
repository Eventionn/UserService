import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userService = {
  async getAllUsers() {
    return prisma.user.findMany(); 
  },

  async createUser(userData) {
    return prisma.user.create({
      data: userData,
    });
  },
};

export default userService;