const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
import { app, server } from '../src/server';
const request = require('supertest');


jest.mock('@prisma/client', () => {
    const mockPrisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    return { PrismaClient: jest.fn(() => mockPrisma) };
  });
  
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();



const randomEmail = faker.internet.email();
describe('POST /api/users', () => {
    beforeEach(() => {
      jest.clearAllMocks(); 
    });
  
    it('should return 400 if email, password, or username are missing', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ email: 'test@example.com', password: '12345678' }); 
  
      expect(res.status).toBe(400);
      expect(res.text).toBe('Field missing');
    });
  
    it('should return 400 if password is less than 8 characters', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ email: 'test@example.com', password: '12345', username: 'testuser' });
  
      expect(res.status).toBe(400);
      expect(res.text).toBe('password must be at least 8 characters');
    });
  
    it('should return 400 if the email already exists', async () => {
      // Simula que o email já existe
      prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'pedro.gomes1692003@gmail.com' });
  
      const res = await request(app)
        .post('/api/users')
        .send({ email: 'pedro.gomes1692003@gmail.com', password: '12345555', username: 'testuserr' });
  
      expect(res.status).toBe(400);
      expect(res.text).toBe('Email Already Exists');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'pedro.gomes1692003@gmail.com' } });
    });
  
    it('should return 201 and create the user successfully', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      prisma.user.create.mockResolvedValue({
        id: 1,
        email: randomEmail,
        username: 'testuser',
        createdAt: new Date().toISOString(),
        password: '$2a$10$rkh4IRdQn8ME1S5vciv2u.l9bws9bTgj9DqP7uqlrSPI0XUrF6m5C', // Hash da senha simulada
        loginType: 'simple',
        status: true,
        usertype_id: '2c6aab42-7274-424e-8c10-e95441cb95c3',
      });
  
      const res = await request(app)
        .post('/api/users')
        .send({ email: randomEmail, password: '12345678', username: 'testuser' });
  
      expect(res.status).toBe(201);
      expect(res.body.username).toBe('testuser');
      expect(res.body).toHaveProperty('createdAt');
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
            email: randomEmail,
            password: expect.any(String), // Aceita qualquer hash gerado dinamicamente
            username: 'testuser',
            loginType: 'simple',
            status: true,
            usertype_id: '2c6aab42-7274-424e-8c10-e95441cb95c3',
          }),
      
      });
    });
  
    afterAll(() => {
      server.close(); // Fecha o servidor ao final dos testes
    });
  });