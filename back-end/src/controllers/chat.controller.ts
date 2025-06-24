import express from 'express';
import prisma from '../prisma';
import { ChatService } from '../services/chat.service';
import { IChatController } from '../interfaces/chat.interface';

export class ChatController implements IChatController {
  private readonly chatService: ChatService;
  constructor(chatService: ChatService) {
    this.chatService = chatService;
  }

  public async createMessage(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const { text } = req.body;
      const { chatId } = req.params;

      const message = await this.chatService.createMessage(chatId, text);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', message: error });
    }
  }

  public async getChatHistory() {}
}
