import prisma from '../prisma';

export class MessageService {
  async create(
    chatId: string | number,
    text: string,
    order: number,
    sender: string = "user" // valor padrão
  ) {
    return await prisma.message.create({
      data: {
        chatId: Number(chatId),
        text,
        order,
        sender
      },
    });
  }

  async getChatHistory(chatId: string | number) {
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
