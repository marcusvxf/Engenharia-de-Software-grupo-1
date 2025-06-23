import { PrismaClient } from '@prisma/client';

export class ChatService {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async createMessage(chatId: string, text: string): Promise<any> {
    if (!chatId || !text) {
      throw new Error('chatId and text are required');
    }

    const message = await this.prisma.message.create({
      data: {
        chat_id: chatId,
        text: text,
        order: 1, // This should be set based on the existing messages in the chat
      },
    });

    return message;
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
