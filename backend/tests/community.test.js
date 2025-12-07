const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./app');
const User = require('../models/User');
const Community = require('../models/Community');
const Message = require('../models/Message');

let mongoServer;
let token;

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
  await Message.deleteMany({});
  await Community.deleteMany({});
  await User.deleteMany({});
});

async function registerAndGetToken(email = 'test@example.com') {
  const res = await request(app).post('/api/auth/register').send({
    name: 'Test User',
    email,
    password: 'password123',
    role: 'student'
  });
  return { token: res.body.token, userId: res.body.user.id };
}

describe('POST /api/community', () => {
  it('should create a community group', async () => {
    const { token } = await registerAndGetToken();
    const res = await request(app)
      .post('/api/community')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Group', description: 'A test group', category: 'support' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test Group');
    expect(res.body.members).toHaveLength(1);
  });

  it('should reject missing fields', async () => {
    const { token } = await registerAndGetToken();
    const res = await request(app)
      .post('/api/community')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Missing fields' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/community', () => {
  it('should return all community groups', async () => {
    const { token } = await registerAndGetToken();
    await request(app)
      .post('/api/community')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Group 1', description: 'Desc 1', category: 'support' });
    await request(app)
      .post('/api/community')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Group 2', description: 'Desc 2', category: 'wellness' });

    const res = await request(app)
      .get('/api/community')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});

describe('POST /api/community/:id/join', () => {
  it('should allow a user to join a group', async () => {
    const { token: token1 } = await registerAndGetToken('user1@example.com');
    const createRes = await request(app)
      .post('/api/community')
      .set('Authorization', `Bearer ${token1}`)
      .send({ name: 'Join Test', description: 'Test', category: 'support' });
    const groupId = createRes.body._id;

    const { token: token2 } = await registerAndGetToken('user2@example.com');
    const res = await request(app)
      .post(`/api/community/${groupId}/join`)
      .set('Authorization', `Bearer ${token2}`);
    expect(res.status).toBe(200);
    expect(res.body.members).toHaveLength(2);
  });

  it('should reject duplicate join', async () => {
    const { token } = await registerAndGetToken();
    const createRes = await request(app)
      .post('/api/community')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Dup Test', description: 'Test', category: 'support' });
    const groupId = createRes.body._id;

    const res = await request(app)
      .post(`/api/community/${groupId}/join`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already/i);
  });
});

describe('POST /api/community/:id/leave', () => {
  it('should allow a member to leave', async () => {
    const { token: token1 } = await registerAndGetToken('user1@example.com');
    const createRes = await request(app)
      .post('/api/community')
      .set('Authorization', `Bearer ${token1}`)
      .send({ name: 'Leave Test', description: 'Test', category: 'support' });
    const groupId = createRes.body._id;

    const { token: token2 } = await registerAndGetToken('user2@example.com');
    await request(app)
      .post(`/api/community/${groupId}/join`)
      .set('Authorization', `Bearer ${token2}`);

    const res = await request(app)
      .post(`/api/community/${groupId}/leave`)
      .set('Authorization', `Bearer ${token2}`);
    expect(res.status).toBe(200);
    expect(res.body.members).toHaveLength(1);
  });

  it('should reject leave if not a member', async () => {
    const { token: token1 } = await registerAndGetToken('user1@example.com');
    const createRes = await request(app)
      .post('/api/community')
      .set('Authorization', `Bearer ${token1}`)
      .send({ name: 'Not Member', description: 'Test', category: 'support' });
    const groupId = createRes.body._id;

    const { token: token2 } = await registerAndGetToken('user2@example.com');
    const res = await request(app)
      .post(`/api/community/${groupId}/leave`)
      .set('Authorization', `Bearer ${token2}`);
    expect(res.status).toBe(400);
  });
});

describe('POST /api/community/:id/message', () => {
  it('should post a message to the group', async () => {
    const { token } = await registerAndGetToken();
    const createRes = await request(app)
      .post('/api/community')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Msg Group', description: 'Test', category: 'support' });
    const groupId = createRes.body._id;

    const res = await request(app)
      .post(`/api/community/${groupId}/message`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Hello everyone!' });
    expect(res.status).toBe(200);
    expect(res.body.content).toBe('Hello everyone!');
    expect(res.body.user).toBeDefined();
  });

  it('should reject message from non-member', async () => {
    const { token: token1 } = await registerAndGetToken('user1@example.com');
    const createRes = await request(app)
      .post('/api/community')
      .set('Authorization', `Bearer ${token1}`)
      .send({ name: 'Msg Group', description: 'Test', category: 'support' });
    const groupId = createRes.body._id;

    const { token: token2 } = await registerAndGetToken('user2@example.com');
    const res = await request(app)
      .post(`/api/community/${groupId}/message`)
      .set('Authorization', `Bearer ${token2}`)
      .send({ content: 'Hello!' });
    expect(res.status).toBe(403);
  });
});
