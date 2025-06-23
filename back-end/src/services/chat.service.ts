import { PrismaClient } from '@prisma/client';
import {
  IChatService,
  ICreateMessageOutput,
} from '../interfaces/chat.interface';

export class ChatService implements IChatService {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async createMessage(
    chatId: string,
    text: string
  ): Promise<ICreateMessageOutput> {
    if (!chatId || !text) {
      throw new Error('chatId and text are required');
    }

    const message = await this.prisma.message.create({
      data: {
        chat_id: chatId,
        text: text,
      },
    });

    if (!message) {
      throw new Error('Failed to create message');
    }

    return message as ICreateMessageOutput;
  }

  public async getChatHistory(chatId: string): Promise<any[]> {
    if (!chatId) {
      throw new Error('chatId is required');
    }

    const messages = await this.prisma.message.findMany({
      where: { chat_id: chatId },
      orderBy: { order: 'asc' },
    });

    return messages;
  }
}
