const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./app');
const User = require('../models/User');
const CheckIn = require('../models/CheckIn');

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
  await CheckIn.deleteMany({});
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

describe('POST /api/mood/check-in', () => {
  it('should create a mood check-in', async () => {
    token = await registerAndGetToken();
    const res = await request(app)
      .post('/api/mood/check-in')
      .set('Authorization', `Bearer ${token}`)
      .send({ moodScore: 7, energyLevel: 6, method: 'text', text: 'Feeling good' });
    expect(res.status).toBe(200);
    expect(res.body.checkIn.moodScore).toBe(7);
    expect(res.body.checkIn.energyLevel).toBe(6);
    expect(res.body.streak).toBeDefined();
    expect(res.body.streak.count).toBe(1);
  });

  it('should start streak on first check-in', async () => {
    token = await registerAndGetToken();
    const res = await request(app)
      .post('/api/mood/check-in')
      .set('Authorization', `Bearer ${token}`)
      .send({ moodScore: 5, energyLevel: 5, method: 'text' });
    expect(res.body.streak.count).toBe(1);
    expect(res.body.streak.plantLevel).toBe('sprout');
  });

  it('should reject without auth', async () => {
    const res = await request(app)
      .post('/api/mood/check-in')
      .send({ moodScore: 7, energyLevel: 6, method: 'text' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/mood/history', () => {
  it('should return mood history', async () => {
    token = await registerAndGetToken();
    await request(app)
      .post('/api/mood/check-in')
      .set('Authorization', `Bearer ${token}`)
      .send({ moodScore: 7, energyLevel: 6, method: 'text' });
    await request(app)
      .post('/api/mood/check-in')
      .set('Authorization', `Bearer ${token}`)
      .send({ moodScore: 8, energyLevel: 7, method: 'text' });

    const res = await request(app)
      .get('/api/mood/history')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('should reject without auth', async () => {
    const res = await request(app).get('/api/mood/history');
    expect(res.status).toBe(401);
  });
});
