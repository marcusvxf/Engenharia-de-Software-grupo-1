export interface ICreateMessageOutput {
  answer: string;
  answerId: number;
  answerDate: Date;
}

export interface IChatEntity {
  id: number;
  name: string;
  createdAt: Date;
  userId: number;
}

export interface IChatService {
  createMessage(chatId: string, text: string): Promise<ICreateMessageOutput>;
  getChatHistory(chatId: string): Promise<any[]>;
}

export interface IChatController {
  createMessage(req: any, res: any): Promise<void>;
  getChatHistory(req: any, res: any): Promise<void>;
}
