// back-end/src/routes/chat.routes.ts

import express from 'express';
import { createChat, getChatsByUserId } from '../controllers/chat.controller';

const router = express.Router();

router.post('/',
  /* #swagger.tags = ['Chats']
      #swagger.summary = 'Criar uma nova conversa.'
      #swagger.description = 'Endpoint para criar uma nova conversa associada a um usuário.'
      #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados para criar a nova conversa.',
          required: true,
          schema: {
              name: "Dúvidas sobre Aproveitamento de Créditos",
              userId: 1
          }
      }
      #swagger.responses[201] = {
          description: 'Conversa criada com sucesso.',
          schema: { id: 1, name: "Dúvidas sobre Aproveitamento de Créditos", createdAt: "2025-08-08T02:30:00.000Z", userId: 1 }
      }
      #swagger.responses[400] = { description: 'Dados inválidos (nome ou userId faltando).' }
  */
  createChat
);

router.get('/user/:userId',
  /* #swagger.tags = ['Chats']
      #swagger.summary = 'Listar as conversas de um usuário.'
      #swagger.description = 'Endpoint para obter todas as conversas de um usuário específico pelo seu ID.'
      #swagger.parameters['userId'] = {
          in: 'path',
          description: 'ID do usuário para buscar as conversas.',
          required: true,
          type: 'integer'
      }
      #swagger.responses[200] = {
          description: 'Lista de conversas obtida com sucesso.',
          schema: [
              { id: 1, name: "Dúvidas sobre Aproveitamento de Créditos", createdAt: "2025-08-08T02:30:00.000Z", userId: 1 }
          ]
      }
      #swagger.responses[400] = { description: 'ID de usuário inválido.' }
  */
  getChatsByUserId
);

export default router;