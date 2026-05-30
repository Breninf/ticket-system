import request from 'supertest';
import app from '../src/app.js';

describe('Health API', () => {

  test('should return 200 on /health', async () => {

    const response = await request(app)
      .get('/health');

    expect(response.statusCode).toBe(200);

  });

});

describe('Auth API', () => {

  test('should login successfully', async () => {

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        password: '123456'
      });

    expect(response.statusCode).toBe(200);

  });

  test('should return 401 for invalid credentials', async () => {

    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'wrong-password'
      });

    expect(response.statusCode).toBe(401);

  });

  test('should return 400 when fields are missing', async () => {

    const response = await request(app)
      .post('/auth/login')
      .send({});

    expect(response.statusCode).toBe(400);

  });

});