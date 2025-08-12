import { Request, Response } from 'express';
import { MessageService } from '../services/message.service';
import { RagService } from '../services/external/rag.service';

let messageService = new MessageService();
let ragService = new RagService();

/** Controller para lidar com o envio de mensagens
 * @param {Object} req - Requisição HTTP contendo os dados da mensagem
 * @param {Object} res - Resposta HTTP contendo o status e o corpo da resposta
 */
export const sendMessage = async (req: Request, res: Response) => {
  const { chatId, text, order } = req.body;
  
  try {
    console.log(`📝 Nova mensagem recebida - Chat: ${chatId}, Texto: "${text}"`);
    
    // 1. Salvar mensagem do usuário
    const userMessage = await messageService.create(chatId, text, order || 1);
    console.log('✅ Mensagem do usuário salva');
    
    // 2. Buscar histórico do chat para contexto
    const chatHistory = await messageService.getChatHistory(chatId);
    const historyText = chatHistory
      .slice(-5) // Pega apenas as últimas 5 mensagens para contexto
      .map((msg: any) => msg.text)
      .join('\n');
    
    // 3. Obter resposta do RAG
    const ragResponse = await ragService.getAnswer(text, historyText);
    console.log(`🤖 Resposta do RAG: "${ragResponse}"`);
    
    // 4. Salvar resposta do RAG como nova mensagem
    const nextOrder = userMessage.order + 1;
    const botMessage = await messageService.create(chatId, ragResponse, nextOrder);
    console.log('✅ Resposta do bot salva');
    
    // 5. Retornar ambas as mensagens
    res.status(201).json({
      userMessage,
      botMessage,
      success: true
    });
    
  } catch (error) {
    console.error('❌ Erro no sendMessage:', error);
    res.status(500).json({ 
      error: 'Failed to create message', 
      message: error instanceof Error ? error.message : 'Unknown error',
      success: false 
    });
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