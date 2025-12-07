const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./app');
const User = require('../models/User');
const Token = require('../models/Token');
const CheckIn = require('../models/CheckIn');
const Journal = require('../models/Journal');

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
  await Token.deleteMany({});
  await CheckIn.deleteMany({});
  await Journal.deleteMany({});
  await User.deleteMany({});
});

async function registerAndGetToken() {
  const res = await request(app).post('/api/auth/register').send({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'student'
  });
  return res.body.token;
}

// ---- Token tests ----

describe('GET /api/tokens', () => {
  it('should return empty token history', async () => {
    token = await registerAndGetToken();
    const res = await request(app)
      .get('/api/tokens')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

describe('POST /api/tokens', () => {
  it('should add earned tokens', async () => {
    token = await registerAndGetToken();
    const res = await request(app)
      .post('/api/tokens')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 10, type: 'earned', source: 'streak', description: 'Daily streak bonus' });
    expect(res.status).toBe(200);
    expect(res.body.token.amount).toBe(10);
    expect(res.body.newBalance).toBe(10);
  });

  it('should spend tokens', async () => {
    token = await registerAndGetToken();
    // Earn first
    await request(app)
      .post('/api/tokens')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 20, type: 'earned', source: 'streak', description: 'Earned' });
    // Spend
    const res = await request(app)
      .post('/api/tokens')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 5, type: 'spent', source: 'redemption', description: 'Spent' });
    expect(res.status).toBe(200);
    expect(res.body.newBalance).toBe(15);
  });

  it('should reject spending more than balance', async () => {
    token = await registerAndGetToken();
    const res = await request(app)
      .post('/api/tokens')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 10, type: 'spent', source: 'redemption', description: 'Overspend' });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/insufficient/i);
  });

  it('should reject missing fields', async () => {
    token = await registerAndGetToken();
    const res = await request(app)
      .post('/api/tokens')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 10 });
    expect(res.status).toBe(400);
  });

  it('should reject invalid type', async () => {
    token = await registerAndGetToken();
    const res = await request(app)
      .post('/api/tokens')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 10, type: 'invalid', source: 'streak', description: 'Bad type' });
    expect(res.status).toBe(400);
  });
});

// ---- Dashboard tests ----

describe('GET /api/dashboard/stats', () => {
  it('should return dashboard stats', async () => {
    token = await registerAndGetToken();
    const res = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('streakCount');
    expect(res.body).toHaveProperty('totalCheckIns');
    expect(res.body).toHaveProperty('completedJournals');
    expect(res.body).toHaveProperty('tokenBalance');
  });

  it('should reflect correct counts after activity', async () => {
    token = await registerAndGetToken();

    // Create a check-in
    await request(app)
      .post('/api/mood/check-in')
      .set('Authorization', `Bearer ${token}`)
      .send({ moodScore: 7, energyLevel: 6, method: 'text' });

    // Create a journal
    await request(app)
      .post('/api/journal')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test', content: 'Dashboard test' });

    const res = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.totalCheckIns).toBe(1);
    expect(res.body.completedJournals).toBe(1);
    expect(res.body.streakCount).toBe(1);
  });

  it('should reject without auth', async () => {
    const res = await request(app).get('/api/dashboard/stats');
    expect(res.status).toBe(401);
  });
});

// ---- Health check ----

describe('GET /health', () => {
  it('should return OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.text).toBe('OK');
  });
});
