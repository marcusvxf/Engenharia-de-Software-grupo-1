
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateChatRequest {
  question: string;
  userData?: any;
}

export interface SendMessageRequest {
  message: string;
}
