import express from 'express';
import userRoutes from './routes/user.routes';
import chatRoutes from './routes/chat.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger.json';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(express.json());

app.use('/users', userRoutes);
app.use('/chats', chatRoutes);

export default app;
