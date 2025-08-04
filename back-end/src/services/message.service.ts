import prisma from '../prisma';

export class MessageService {
  async create(chatId: string, text: string, order: number) {
    return await prisma.message.create({
      data: {
        chatId: Number(chatId),
        text,
        order,
      },
    });
  }

  async getChatHistory(chatId: string) {
    return await prisma.message.findMany({
      where: {
        chatId: Number(chatId),
      },
      orderBy: {
        order: 'asc',
      },
    });
  }
}
