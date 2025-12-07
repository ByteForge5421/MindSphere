const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./app');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  process.env.JWT_SECRET = 'test-jwt-secret';
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('POST /api/auth/register', () => {
  const validUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'student'
  };

  it('should register a new user and return token', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.name).toBe(validUser.name);
    expect(res.body.user.email).toBe(validUser.email);
    expect(res.body.user.role).toBe(validUser.role);
  });

  it('should not register duplicate email', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app).post('/api/auth/register').send(validUser);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  it('should reject missing name', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
      role: 'student'
    });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should reject invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test',
      email: 'notanemail',
      password: 'password123',
      role: 'student'
    });
    expect(res.status).toBe(400);
  });

  it('should reject short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test',
      email: 'test@example.com',
      password: '123',
      role: 'student'
    });
    expect(res.status).toBe(400);
  });

  it('should reject invalid role', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test',
      email: 'test@example.com',
      password: 'password123',
      role: 'invalidrole'
    });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'student'
    });
  });

  it('should login with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should reject wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpassword'
    });
    expect(res.status).toBe(400);
  });

  it('should reject non-existent user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'noone@example.com',
      password: 'password123'
    });
    expect(res.status).toBe(400);
  });

  it('should reject missing email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      password: 'password123'
    });
    expect(res.status).toBe(400);
  });
});
