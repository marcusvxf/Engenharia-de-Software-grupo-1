import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/message.controller';

const router = express.Router();

router.post('/'
  /* #swagger.tags = ['Messages']
      #swagger.summary = 'Enviar uma nova mensagem e obter resposta.'
      #swagger.description = 'Endpoint para enviar uma nova mensagem de um usuário para uma conversa específica. A mensagem é processada e uma resposta é gerada.'
      #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados da mensagem a ser enviada.',
          required: true,
          schema: {
              chatId: 1,
              text: 'Olá, preciso de ajuda com o meu plano.'
          }
      }
      #swagger.responses[201] = {
          description: 'Mensagem enviada e resposta recebida com sucesso.',
          schema: {
              id: 1,
              chatId: 1,
              text: 'Olá, preciso de ajuda com o meu plano.',
              order: 1,
              createdAt: '2025-08-08T02:30:00.000Z',
              role: 'user'
          }
      }
      #swagger.responses[500] = { description: 'Erro no servidor.' }
  */,
  sendMessage
);

router.get('/:chatId'
  /* #swagger.tags = ['Messages']
      #swagger.summary = 'Obter o histórico de uma conversa.'
      #swagger.description = 'Endpoint para listar todas as mensagens de uma conversa específica, ordenadas cronologicamente.'
      #swagger.parameters['chatId'] = {
          in: 'path',
          description: 'ID da conversa para buscar o histórico.',
          required: true,
          type: 'integer'
      }
      #swagger.responses[200] = {
          description: 'Histórico da conversa obtido com sucesso.',
          schema: [
              { id: 1, chatId: 1, text: 'Olá!', order: 1, createdAt: '2025-08-08T02:30:00.000Z', role: 'user' },
              { id: 2, chatId: 1, text: 'Olá! Como posso ajudar?', order: 2, createdAt: '2025-08-08T02:30:05.000Z', role: 'assistant' }
          ]
      }
      #swagger.responses[500] = { description: 'Erro no servidor.' }
  */,
  getChatHistory
);

export default router;
