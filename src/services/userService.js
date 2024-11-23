import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userService = {
  async getAllUsers() {
    return await prisma.user.findMany(); 
  },

  async createUser(userData) {
    return await prisma.user.create({
      data: userData,
    });
  },

  async findUserById(id) {
    return await prisma.user.findUnique({
      where: { userID: id },
    })
  },

  async findUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    })
  },

  async updateUser(user, updates) {
    const updatedUser = await prisma.user.update({
      where: { userID: user.userID }, 
      data: updates, 
    });
  
    return updatedUser;
  },

  async deleteUserById(id) {
    await prisma.user.delete({
      where: { userID: id },
    });
  }
  
};

export default userService;