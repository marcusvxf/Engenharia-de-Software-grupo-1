import express from 'express';
import prisma from '../prisma';
import { ChatService } from '../services/chat.service';

export class ChatController {
  private readonly chatService: ChatService;
  constructor(chatService: ChatService) {
    this.chatService = chatService;
  }

  public async createMessage(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const { chatId, text } = req.body;

      const message = await this.chatService.createMessage(chatId, text);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getChatHistory() {}
}
