import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import ticketRoutes from './routes/ticket.routes.js';

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/auth', authRoutes);

app.use('/tickets', ticketRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;