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
      where: { id },
    })
  },

  async findUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    })
  },

  async updateUser(user, updates) {
    Object.assign(user, updates); 
    await user.save(); 
    return user;
  },

  async deleteUserById(id) {
    await prisma.user.delete({
      where: { id },
    });
  }
  
};

export default userService;