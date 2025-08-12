// back-end/src/index.ts

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express'; // <-- Importe a nova biblioteca
import swaggerDocument from './swagger.json'; // <-- Importe o arquivo que geramos

import userRoutes from './routes/user.routes';
import chatRoutes from './routes/chat.routes';
import messageRoutes from './routes/message.route'; // <-- Adicionei a importação que faltava
import { authenticateMiddleware } from './middlewares/authenticate.middleware';

const app = express();

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false 
}));

app.use(express.json());

// Rota principal da documentação
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Nossas rotas da API
app.use('/users', userRoutes);
app.use('/chats', authenticateMiddleware, chatRoutes);
app.use('/messages', authenticateMiddleware, messageRoutes); // <-- Adicionei a rota que faltava
export default app;
