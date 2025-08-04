import express from 'express';
import { createChat, getChatsByUserId } from '../controllers/chat.controller';

const router = express.Router();

// Rota para criar uma nova conversa
router.post('/', createChat);

// Rota para listar todas as conversas de um usuário específico
// O ":userId" indica que esta parte da URL é um parâmetro dinâmico
router.get('/user/:userId', getChatsByUserId);

export default router;
