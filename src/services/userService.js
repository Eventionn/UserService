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

  async updateUser(id, updates) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }

    Object.assign(user, updates); 
    await user.save(); 
    return user;
  },
};

export default userService;