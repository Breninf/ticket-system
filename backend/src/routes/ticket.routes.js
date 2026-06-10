import express from 'express';
import { create, findAll, findOne, update, remove } from '../controllers/ticket.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js'; // Reutilizando sua segurança!

const router = express.Router();

router.post('/', authMiddleware, create); // Só logado cria chamado
router.get('/', authMiddleware, findAll); // Só logado vê chamado
router.get('/:id', authMiddleware, findOne);  // Ver detalhes de um chamado
router.put('/:id', authMiddleware, update);   // Editar um chamado (mudar status/texto)
router.delete('/:id', authMiddleware, remove); // Deletar um chamado

export default router;
