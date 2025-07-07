import express from 'express';
import userRoutes from './routes/user.routes';
import chatRoutes from './routes/chat.routes';

const app = express();

app.use(express.json());

app.use('/users', userRoutes);
app.use('/chats', chatRoutes);

export default app;
