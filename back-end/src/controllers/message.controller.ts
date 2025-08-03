import { Request, Response } from 'express';
import { MessageService } from '../services/message.service';

let messageService = new MessageService();

/** Controller para lidar com o envio de mensagens
 * @param {Object} req - Requisição HTTP contendo os dados da mensagem
 * @param {Object} res - Resposta HTTP contendo o status e o corpo da resposta
 */
export const sendMessage = async (req: Request, res: Response) => {
  const { chatId, text, order } = req.body;
  try {
    const message = await messageService.create(chatId, text, order);
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create message', message: error });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const messages = await messageService.getChatHistory(chatId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
};
