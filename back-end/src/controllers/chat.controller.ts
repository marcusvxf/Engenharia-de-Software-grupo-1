// back-end/src/controllers/chat.controller.ts
import { Request, Response } from 'express';
import { ChatService } from '../services/chat.service';

const chatService = new ChatService();

/**
 * Controller para lidar com a criação de uma nova conversa.
 */
export const createChat = async (req: Request, res: Response) => {
  console.log('📝 createChat: req.body', req.body);
  // Extrai o nome da conversa e o ID do usuário do corpo da requisição
  const { name, userId } = req.body;

  // Validação básica para garantir que os dados foram enviados
  if (!name || !userId) {
    return res
      .status(400)
      .json({ message: 'O nome da conversa e o userId são obrigatórios.' });
  }

  try {
    const chat = await chatService.create(name, userId);
    console.log('✅ createChat: Chat criado com sucesso');
    res.status(201).json(chat);
  } catch (error) {
    console.error('❌ createChat: Erro:', error);
    res.status(500).json({ message: 'Erro ao criar a conversa.' });
  }
};

/**
 * Controller para lidar com a listagem de conversas de um usuário.
 */
export const getChatsByUserId = async (req: Request, res: Response) => {
  // Pega o ID do usuário dos parâmetros da URL (ex: /chats/user/01ARZ3NDEKTSV4RRFFQ69G5FAV)
  const userId = req.params.userId;
  
  console.log('🔍 getChatsByUserId: Buscando chats para userId:', userId);

  if (!userId || userId.trim() === '') {
    return res.status(400).json({ message: 'O ID do usuário é obrigatório.' });
  }

  try {
    const chats = await chatService.getByUserId(userId);
    console.log('✅ getChatsByUserId: Chats encontrados:', chats.length);
    res.json(chats);
  } catch (error) {
    console.error('❌ getChatsByUserId: Erro:', error);
    res.status(500).json({ message: 'Erro ao buscar as conversas.' });
  }
};
