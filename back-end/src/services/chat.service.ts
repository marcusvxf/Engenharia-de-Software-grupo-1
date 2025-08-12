// back-end/src/services/chat.service.ts
import prisma from '../prisma';

export class ChatService {
  /**
   * Cria uma nova conversa no banco de dados.
   * @param name - O nome da conversa.
   * @param userId - O ID do usuário que está criando a conversa.
   */
  async create(name: string, userId: string) {
    console.log('📝 ChatService.create: Criando chat para userId:', userId);
    const chat = await prisma.chat.create({
      data: {
        name,
        userId: userId,
      },
    });
    console.log('✅ ChatService.create: Chat criado com ID:', chat.id);
    return chat;
  }

  /**
   * Busca no banco de dados todas as conversas de um usuário específico.
   * @param userId - O ID do usuário cujas conversas serão listadas.
   */
  async getByUserId(userId: string) {
    console.log('🔍 ChatService.getByUserId: Buscando chats para userId:', userId);
    const chats = await prisma.chat.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        created_at: 'desc', // Ordenar por data de criação, mais recente primeiro
      },
    });
    console.log('📊 ChatService.getByUserId: Encontrados:', chats.length, 'chats');
    return chats;
  }
}
