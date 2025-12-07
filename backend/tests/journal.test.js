const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./app');
const User = require('../models/User');
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

describe('POST /api/journal', () => {
  it('should create a journal entry', async () => {
    token = await registerAndGetToken();
    const res = await request(app)
      .post('/api/journal')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My Day', content: 'Today was good', tags: ['happy'] });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('My Day');
    expect(res.body.content).toBe('Today was good');
    expect(res.body.tags).toContain('happy');
  });

  it('should reject without auth', async () => {
    const res = await request(app)
      .post('/api/journal')
      .send({ title: 'My Day', content: 'Today was good' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/journal', () => {
  it('should return user journals', async () => {
    token = await registerAndGetToken();
    await request(app)
      .post('/api/journal')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Entry 1', content: 'Content 1' });
    await request(app)
      .post('/api/journal')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Entry 2', content: 'Content 2' });

    const res = await request(app)
      .get('/api/journal')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('should not return other users journals', async () => {
    token = await registerAndGetToken();
    await request(app)
      .post('/api/journal')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Private Entry', content: 'Secret' });

    // Register second user
    const res2 = await request(app).post('/api/auth/register').send({
      name: 'Other User',
      email: 'other@example.com',
      password: 'password123',
      role: 'student'
    });
    const token2 = res2.body.token;

    const res = await request(app)
      .get('/api/journal')
      .set('Authorization', `Bearer ${token2}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

describe('GET /api/journal/:id', () => {
  it('should return a specific journal entry', async () => {
    token = await registerAndGetToken();
    const createRes = await request(app)
      .post('/api/journal')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My Entry', content: 'Test content' });
    const journalId = createRes.body._id;

    const res = await request(app)
      .get(`/api/journal/${journalId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('My Entry');
  });

  it('should return 404 for non-existent journal', async () => {
    token = await registerAndGetToken();
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/journal/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/journal/:id', () => {
  it('should update a journal entry', async () => {
    token = await registerAndGetToken();
    const createRes = await request(app)
      .post('/api/journal')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Original', content: 'Original content' });
    const journalId = createRes.body._id;

    const res = await request(app)
      .put(`/api/journal/${journalId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated', content: 'Updated content' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated');
  });

  it('should return 404 for non-existent', async () => {
    token = await registerAndGetToken();
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/journal/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/journal/:id', () => {
  it('should delete a journal entry', async () => {
    token = await registerAndGetToken();
    const createRes = await request(app)
      .post('/api/journal')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'To Delete', content: 'Will be deleted' });
    const journalId = createRes.body._id;

    const res = await request(app)
      .delete(`/api/journal/${journalId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/removed/i);

    // Verify deleted
    const getRes = await request(app)
      .get(`/api/journal/${journalId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(404);
  });

  it('should return 404 for non-existent', async () => {
    token = await registerAndGetToken();
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/journal/${fakeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
