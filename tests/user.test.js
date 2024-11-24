import request from 'supertest';
import app from '../app'; // Supondo que seu app esteja exportado em 'app.js'
import userService from '../services/userService';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../services/userService');

describe('User Controller', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create a new user successfully', async () => {
    const newUser = {
      email: 'testuser@example.com',
      password: 'password123',
      username: 'testuser',
    };

    userService.createUser.mockResolvedValue({
      id: '123',
      ...newUser,
    });

    const response = await request(app)
      .post('/api/users')
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.username).toBe(newUser.username);
  });

  test('should return 400 if email already exists', async () => {
    const existingUser = {
      email: 'testuser@example.com',
      password: 'password123',
      username: 'testuser',
    };

    userService.findUserByEmail.mockResolvedValue(existingUser);

    const response = await request(app)
      .post('/api/users')
      .send(existingUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email already exists');
  });

  test('should change the user password successfully', async () => {
    const token = jwt.sign({ email: 'testuser@example.com' }, 'SECRET_KEY');
    const oldPassword = 'password123';
    const newPassword = 'newpassword123';

    const user = {
      email: 'testuser@example.com',
      password: await bcryptjs.hash(oldPassword, 10),
    };

    userService.findUserByEmail.mockResolvedValue(user);
    userService.updateUser.mockResolvedValue({
      ...user,
      password: await bcryptjs.hash(newPassword, 10),
    });

    const response = await request(app)
      .put('/api/users/change-password')
      .set('token', token)
      .send({ oldPassword, newPassword });

    expect(response.status).toBe(200);
    expect(response.text).toBe('password changed');
  });

  test('should return 400 if old password is incorrect', async () => {
    const token = jwt.sign({ email: 'testuser@example.com' }, 'SECRET_KEY');
    const oldPassword = 'wrongpassword';
    const newPassword = 'newpassword123';

    const user = {
      email: 'testuser@example.com',
      password: await bcryptjs.hash('password123', 10),
    };

    userService.findUserByEmail.mockResolvedValue(user);

    const response = await request(app)
      .put('/api/users/change-password')
      .set('token', token)
      .send({ oldPassword, newPassword });

    expect(response.status).toBe(400);
    expect(response.text).toBe('old password not match');
  });

  test('should return 404 if user not found by email', async () => {
    const email = 'notfound@example.com';

    userService.findUserByEmail.mockResolvedValue(null);

    const response = await request(app)
      .get(`/api/users/byemail/${email}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });

  // Teste para obter todos os usuários
  test('should return all users successfully', async () => {
    const users = [
      { id: '1', email: 'user1@example.com', username: 'user1' },
      { id: '2', email: 'user2@example.com', username: 'user2' },
    ];

    userService.getAllUsers.mockResolvedValue(users);

    const response = await request(app).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].email).toBe('user1@example.com');
    expect(response.body[1].email).toBe('user2@example.com');
  });

});

