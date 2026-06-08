import dotenv from 'dotenv';
dotenv.config();

import request from 'supertest';
import app from '../src/app.js';

// Utilitário para gerar e-mails únicos e evitar erros de registro duplicado
const generateUniqueEmail = () => `test-${Date.now()}@example.com`;

describe('Health API', () => {
  test('should return 200 on /health', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
  });
});

describe('Auth API & Profile', () => {
  const userPassword = 'password123';
  let userEmail;

  beforeAll(() => {
    userEmail = generateUniqueEmail();
  });

  test('should register a new user successfully with name', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: userEmail,
        password: userPassword
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.name).toBe('Test User');
  });

  test('should login successfully with the registered user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: userEmail,
        password: userPassword
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('should return 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: userEmail,
        password: 'wrong-password'
      });

    expect(response.statusCode).toBe(401);
  });

  test('should return 400 when name/email/password fields are missing on register', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        email: userEmail
      });

    expect(response.statusCode).toBe(400);
  });
});

describe('Tickets CRUD & Security Operations', () => {
  const userPassword = 'password123';
  let tokenUser1;
  let tokenUser2;
  let createdTicketId;

  // Prepara o banco criando dois usuários diferentes com garantia de isolamento por tempo e sufixo aleatório
  beforeAll(async () => {
    const email1 = `user1-${Date.now()}-${Math.random()}@test.com`;
    const email2 = `user2-${Date.now()}-${Math.random()}@test.com`;

    // 1. Cadastra e loga o Usuário 1 de forma estritamente sequencial
    await request(app).post('/auth/register').send({ name: 'User One', email: email1, password: userPassword });
    const login1 = await request(app).post('/auth/login').send({ email: email1, password: userPassword });
    tokenUser1 = login1.body.token;

    // Pequeno intervalo em milissegundos para o carimbo de data do JavaScript atualizar perfeitamente
    await new Promise(resolve => setTimeout(resolve, 50));

    // 2. Cadastra e loga o Usuário 2 (Garantindo um registro e token completamente novos)
    await request(app).post('/auth/register').send({ name: 'User Two', email: email2, password: userPassword });
    const login2 = await request(app).post('/auth/login').send({ email: email2, password: userPassword });
    tokenUser2 = login2.body.token;
  });

  test('should return 401 when token is missing on tickets route', async () => {
    const response = await request(app).get('/tickets');
    expect(response.statusCode).toBe(401);
  });

  test('should return 401 for invalid token format', async () => {
    const response = await request(app)
      .get('/tickets')
      .set('Authorization', 'Bearer invalid-token-string');
    expect(response.statusCode).toBe(401);
  });

  test('should create a ticket successfully for logged user (POST)', async () => {
    const response = await request(app)
      .post('/tickets')
      .set('Authorization', `Bearer ${tokenUser1}`)
      .send({
        title: 'Database connection drop',
        description: 'Postgres container stopped unexpectedly'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.ticket.status).toBe('OPEN'); // Valida enum padrão
    
    createdTicketId = response.body.ticket.id; // Guarda o ID para os próximos testes
  });

  test('should list all tickets belonging to the logged user (GET)', async () => {
    const response = await request(app)
      .get('/tickets')
      .set('Authorization', `Bearer ${tokenUser1}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.tickets)).toBe(true);
    expect(response.body.tickets.length).toBeGreaterThan(0);
  });

  test('should get a single ticket by id (GET /:id)', async () => {
    const response = await request(app)
      .get(`/tickets/${createdTicketId}`)
      .set('Authorization', `Bearer ${tokenUser1}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.ticket.id).toBe(createdTicketId);
  });

  test('should update ticket text and status enum successfully (PUT)', async () => {
    const response = await request(app)
      .put(`/tickets/${createdTicketId}`)
      .set('Authorization', `Bearer ${tokenUser1}`)
      .send({
        title: 'Database connection drop - RESOLVED',
        status: 'CLOSED' // Testando a transição do enum
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.ticket.status).toBe('CLOSED');
  });

  test('SECURITY TRAVA: User 2 should NOT be able to view User 1 ticket', async () => {
    const response = await request(app)
      .get(`/tickets/${createdTicketId}`)
      .set('Authorization', `Bearer ${tokenUser2}`); // Token do invasor

    expect(response.statusCode).toBe(403); // Bloqueado pela nossa trava de propriedade!
  });

  test('should delete ticket successfully (DELETE)', async () => {
    const response = await request(app)
      .delete(`/tickets/${createdTicketId}`)
      .set('Authorization', `Bearer ${tokenUser1}`);

    expect(response.statusCode).toBe(200);
  });

  test('should return 404 for a ticket that was already deleted', async () => {
    const response = await request(app)
      .get(`/tickets/${createdTicketId}`)
      .set('Authorization', `Bearer ${tokenUser1}`);

    expect(response.statusCode).toBe(404);
  });
});
