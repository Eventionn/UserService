import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userService = {
  async getAllUsers() {
    return await prisma.user.findMany({
      include: {
        userType: true,
      },
    });
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

  async findUsersPaginated(page = 1, limit = 10, search = null) {
    const skip = (page - 1) * limit;

    const searchFilter = search
      ? {
        username: {
          contains: search,
          mode: 'insensitive',
        },
      }
      : {};

    const where = {
      AND: [
        ...Object.keys(searchFilter).length ? [searchFilter] : [],
      ],
    };

    const total = await prisma.user.count({ where });

    const data = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      include: {
        userType: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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