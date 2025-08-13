import prisma from '../prisma';

export class MessageService {
  async create(
    chatId: string | number,
    text: string,
    order: number = 1 // valor padrão
  ) {
    let getLastOrder = await prisma.message.findMany({
      where: {
        chatId: Number(chatId),
      },
      orderBy: {
        order: 'desc',
      },
      take: 1,
    });
    let lastOrder = getLastOrder[0]?.order ?? order ?? 1;
    return await prisma.message.create({
      data: {
        chatId: Number(chatId),
        text,
        order: lastOrder ?? 1,
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
