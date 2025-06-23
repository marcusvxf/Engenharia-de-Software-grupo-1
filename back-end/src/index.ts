import express from 'express';
import userRoutes from './routes/user.routes';
import chatRoutes from './routes/chat.route';

const app = express();

app.use(express.json());
// localhost:8000/chats
app.use('/users', userRoutes);
app.use('/chats', chatRoutes);

export default app;
