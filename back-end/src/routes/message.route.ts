import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/message.controller';
import { MessageService } from '../services/message.service';

const router = express.Router();

router.post('/', sendMessage);
router.get('/:chatId', getChatHistory);

export default router;
