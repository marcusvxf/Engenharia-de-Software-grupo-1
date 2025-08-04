// back-end/src/services/chat.service.ts
import prisma from '../prisma';

export class ChatService {
  /**
   * Cria uma nova conversa no banco de dados.
   * @param name - O nome da conversa.
   * @param userId - O ID do usuário que está criando a conversa.
   */
  async create(name: string, userId: number) {
    return await prisma.chat.create({
      data: {
        name,
        userId,
      },
    });
  }

  /**
   * Busca no banco de dados todas as conversas de um usuário específico.
   * @param userId - O ID do usuário cujas conversas serão listadas.
   */
  async getByUserId(userId: number) {
    return await prisma.chat.findMany({
      where: {
        userId: userId,
      },
    });
  }
}
