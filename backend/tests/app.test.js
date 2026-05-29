import request from 'supertest';
import app from '../src/app.js'; 

describe('API Tests', () => {
  it('should return 200 on /health', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
  });
});