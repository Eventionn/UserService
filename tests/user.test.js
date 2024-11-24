const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userService = require('../src/services/userService');
const { faker } = require('@faker-js/faker');
import { app, server } from '../src/server';
const request = require('supertest');

const randomEmail = faker.internet.email();
describe('POST /api/users', () => {

  it('should return 400 if email, password, or username are missing', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'test@example.com', password: '12345678' }); // Missing username
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
    const res = await request(app)
      .post('/api/users')
      .send({ email: 'pedro.gomes1692003@gmail.com', password: '12345555', username: 'testuserr' });
    expect(res.status).toBe(400);
    expect(res.text).toBe('Email Already Exists');
  });

  it('should return 201 and create the user successfully', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ email: randomEmail, password: '12345678', username: 'testuser' });

    expect(res.status).toBe(201);
    expect(res.body.username).toBe('testuser');
    expect(res.body).toHaveProperty('createdAt');
  });


  afterAll(() => {
    server.close();  // Fecha o servidor quando os testes terminarem
  });

});