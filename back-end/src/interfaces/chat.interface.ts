export interface ICreateMessageOutput {
  answer: string;
  answerId: number;
  answerDate: Date;
}

export interface ICreateMessageInput {
  chatId: string;
  text: string;
}

export interface IChatEntity {
  id: number;
  name: string;
  createdAt: Date;
  userId: number;
}

export interface IMessageEntity {
  id: number;
  chatId: string;
  text: string;
  createdAt: Date;
}
