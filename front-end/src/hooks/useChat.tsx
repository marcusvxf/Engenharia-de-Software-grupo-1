import { useState, useCallback } from 'react';
import { Chat, CreateChatRequest, SendMessageRequest } from '@/types/chat';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

const SERVER_PATH = import.meta.env.VITE_SERVER_PATH || 'http://localhost:3001';

const getUserId = (): number => {
  const storedUserId = localStorage.getItem('userId');
  return storedUserId ? parseInt(storedUserId, 10) : 1;
};

export const useChat = () => {
  const { token } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchChats = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const userId = getUserId();
      const response = await fetch(`${SERVER_PATH}/chats/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChats(data);
      } else if (response.status === 401) {
        toast({
          title: "Sessão expirada",
          description: "Faça login novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast({
        title: "Erro ao carregar chats",
        description: "Não foi possível carregar os chats.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchChat = useCallback(async (chatId: string) => {
    if (!token) return;

    try {
      setLoading(true);
      const messagesResponse = await fetch(`${SERVER_PATH}/messages/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (messagesResponse.ok) {
        const messages = await messagesResponse.json();
        // Find the chat in the current chats list to get chat info
        const chat = chats.find(c => c.id === chatId);
        if (chat) {
          setCurrentChat({
            ...chat,
            messages: messages
          });
        }
      } else if (messagesResponse.status === 404) {
        toast({
          title: "Chat não encontrado",
          description: "O chat solicitado não existe.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching chat:', error);
      toast({
        title: "Erro ao carregar chat",
        description: "Não foi possível carregar o chat.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [token, chats]);

  const createChat = useCallback(async (firstQuestion: string): Promise<string | null> => {
    if (!token) return null;

    try {
      const userId = getUserId();
      const request: CreateChatRequest = {
        name: firstQuestion,
        userId: userId
      };

      const response = await fetch(`${SERVER_PATH}/chats`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (response.status === 201) {
        const data = await response.json();
        await fetchChats(); // Refresh chat list
        return data.id.toString();
      } else {
        toast({
          title: "Erro ao criar chat",
          description: "Não foi possível criar o chat.",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
      return null;
    }
  }, [token, fetchChats]);

  const sendMessage = useCallback(async (chatId: string, messageText: string): Promise<boolean> => {
    if (!token) return false;

    try {
      const request: SendMessageRequest = {
        chatId: parseInt(chatId, 10),
        text: messageText
      };

      const response = await fetch(`${SERVER_PATH}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        await fetchChat(chatId); // Refresh current chat
        return true;
      } else {
        toast({
          title: "Erro ao enviar mensagem",
          description: "Não foi possível enviar a mensagem.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
      return false;
    }
  }, [token, fetchChat]);

  return {
    chats,
    currentChat,
    loading,
    fetchChats,
    fetchChat,
    createChat,
    sendMessage,
    setCurrentChat,
  };
};
