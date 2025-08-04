import express from 'express';
import userRoutes from './routes/user.routes';
import chatRoutes from './routes/chat.routes';
import messageRoutes from './routes/message.route';
const swaggerUi = require('swagger-ui-express');

// const swaggerFile = require('./swagger.json');
import bodyParser from 'body-parser';

const app = express();
console.log('TA etntrando aqui');
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(express.json());

app.use('/users', userRoutes);
app.use('/chats', chatRoutes);
app.use('/messages', messageRoutes);

export default app;
