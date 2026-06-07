import express from 'express';
import { loginController, registerController, profileController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerController);

router.post('/login', loginController);

router.get('/profile', authMiddleware, profileController);

export default router;