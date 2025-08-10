// back-end/src/routes/user.routes.ts

import express from 'express';
import { createUser, getAllUsers, login } from '../controllers/user.controller';

const router = express.Router();

router.get(
  '/',
  /* #swagger.tags = ['Users']
      #swagger.summary = 'Listar todos os usuários.'
      #swagger.description = 'Endpoint para obter uma lista de todos os usuários cadastrados no sistema.'
      #swagger.responses[200] = {
          description: 'Lista de usuários obtida com sucesso.',
          schema: [{ id: 1, name: 'John Doe', email: 'john.doe@example.com' }]
      }
  */
  getAllUsers
);

router.post(
  '/',
  /* #swagger.tags = ['Users']
      #swagger.summary = 'Criar um novo usuário.'
      #swagger.description = 'Endpoint para cadastrar um novo usuário no sistema.'
      #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados do novo usuário.',
          required: true,
          schema: {
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
              password: 'password123'
          }
      }
      #swagger.responses[201] = {
          description: 'Usuário criado com sucesso.',
          schema: { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' }   
      }
      #swagger.responses[400] = {
          description: 'Dados inválidos.'
      }
  */
  createUser
);

router.post(
  '/login',
  /* #swagger.tags = ['Users']
      #swagger.summary = 'Realizar login.'
      #swagger.description = 'Endpoint para realizar o login de um usuário no sistema.'
      #swagger.parameters['body'] = {
          in: 'body',
          description: 'Dados para login.',
          required: true,
          schema: {
              email: 'john.doe@example.com',
              password: 'password123'
          }
      }
      #swagger.responses[200] = {
          description: 'Login realizado com sucesso.',
          schema: { token: 'string' }
      }
      #swagger.responses[400] = {
          description: 'Dados inválidos.'
      }
  */
  login
);

export default router;
