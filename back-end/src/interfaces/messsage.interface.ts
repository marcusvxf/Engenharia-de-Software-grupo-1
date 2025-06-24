export interface IMessageEntity {
  id: number;
  chatId: string;
  text: string;
  createdAt: Date;
  role: string;
}
