import { ChatController } from './chat.controller';
import { ChatService } from '../services/chat.service';
import prisma from '../prisma';

jest.mock('../prisma');

describe('ChatController', () => {
  const chatService = new ChatService(prisma);
  const chatController = new ChatController(chatService);

  describe('createMessage', () => {
    it('should create a new message', async () => {
      const req = {
        body: {
          chatId: '123',
          text: 'Hello, world!',
        },
      };
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      await chatController.createMessage(req, res);

      expect(prisma.message.create).toHaveBeenCalledTimes(1);
      expect(prisma.message.create).toHaveBeenCalledWith({
        data: {
          chat_id: '123',
          text: 'Hello, world!',
          order: 1,
        },
      });
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        chat_id: '123',
        text: 'Hello, world!',
        order: 1,
      });
    });

    it('should throw an error if chatId or text is missing', async () => {
      const req = {
        body: {},
      };
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      await expect(chatController.createMessage(req, res)).rejects.toThrow(
        'chatId and text are required'
      );
    });
  });
});
