import { app, server } from '../src/server';
const request = require('supertest');
const { PrismaClient } = require('@prisma/client');

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();

describe('User Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users/:id', () => {
    it('should return 200 and a user by ID', async () => {
      const mockUser = { userID: "1", email: 'test@example.com', username: 'user1' };
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const res = await request(app).get('/api/users/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { userID: "1" },
      });
    });

    it('should return 404 if user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app).get('/api/users/999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'User not found' });
    });
  });


  describe('DELETE /api/users/:id', () => {
    it('should return 200 and delete the user successfully', async () => {
      const mockUser = { userID: "1", email: 'test@example.com', username: 'user1' };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.delete.mockResolvedValue(mockUser);

      const res = await request(app).delete('/api/users/1');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'User deleted successfully' });
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { userID: "1" },
      });
    });

    it('should return 404 if user to delete is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app).delete('/api/users/999');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'User not found' });
    });
  });

  afterAll(() => {
    server.close();
  });
});
