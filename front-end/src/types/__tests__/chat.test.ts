import { Message, Chat, CreateChatRequest, SendMessageRequest } from '../chat';

describe('Chat Types', () => {
  describe('Message interface', () => {
    it('deve criar mensagem do usuário', () => {
      const message: Message = {
        id: '1',
        text: 'Olá, como você está?',
        isUser: true,
        createdAt: new Date('2024-01-01T10:00:00Z')
      };
      expect(message.isUser).toBe(true);
      expect(message.text).toBe('Olá, como você está?');
      expect(message.id).toBe('1');
    });

    it('deve criar mensagem do bot/assistente', () => {
      const message: Message = {
        id: '2',
        text: 'Olá! Estou bem, obrigado por perguntar.',
        isUser: false,
        createdAt: new Date('2024-01-01T10:01:00Z')
      };
      expect(message.isUser).toBe(false);
      expect(message.text).toBe('Olá! Estou bem, obrigado por perguntar.');
    });
  });

  describe('Chat interface', () => {
    it('deve criar chat sem mensagens', () => {
      const chat: Chat = {
        id: '1',
        name: 'Chat de Teste',
        createdAt: new Date('2024-01-01T09:00:00Z'),
        userId: 1
      };
      expect(chat.messages).toBeUndefined();
      expect(chat.name).toBe('Chat de Teste');
      expect(chat.userId).toBe(1);
    });

    it('deve criar chat com mensagens', () => {
      const messages: Message[] = [
        {
          id: '1',
          text: 'Primeira mensagem',
          isUser: true,
          createdAt: new Date()
        }
      ];
      
      const chat: Chat = {
        id: '1',
        name: 'Chat com Mensagens',
        createdAt: new Date('2024-01-01T09:00:00Z'),
        userId: 1,
        messages
      };
      
      expect(chat.messages).toHaveLength(1);
      expect(chat.messages?.[0].text).toBe('Primeira mensagem');
    });
  });

  describe('CreateChatRequest interface', () => {
    it('deve criar request de chat válido', () => {
      const request: CreateChatRequest = {
        name: 'Novo Chat',
        userId: 123
      };
      expect(request.name).toBe('Novo Chat');
      expect(request.userId).toBe(123);
    });
  });

  describe('SendMessageRequest interface', () => {
    it('deve criar request de mensagem válido', () => {
      const request: SendMessageRequest = {
        chatId: 456,
        text: 'Esta é uma nova mensagem'
      };
      expect(request.chatId).toBe(456);
      expect(request.text).toBe('Esta é uma nova mensagem');
    });
  });
});
