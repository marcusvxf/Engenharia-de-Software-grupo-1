
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  createdAt: Date;
}

export interface Chat {
  id: string;
  name: string;
  createdAt: Date;
  userId: number;
  messages?: Message[];
}

export interface CreateChatRequest {
  name: string;
  userId: number;
}

export interface SendMessageRequest {
  chatId: number;
  text: string;
}
