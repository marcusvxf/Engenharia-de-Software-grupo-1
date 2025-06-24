import express from 'express';
import { ChatController } from '../controllers/chat.controller';
import { ChatService } from '../services/chat.service';
import prisma from '../prisma';

const router = express.Router();
const chatService = new ChatService(prisma);
const chatController = new ChatController(chatService);
// localhost:8000/chats/{chatId}

router.post('/:chatId', chatController.createMessage);

export default router;
