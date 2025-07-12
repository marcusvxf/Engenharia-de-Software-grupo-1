import { useState, useCallback } from 'react';
import { Chat, Message, CreateChatRequest, SendMessageRequest } from '@/types/chat';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

const SERVER_PATH = import.meta.env.VITE_SERVER_PATH || 'http://localhost:3001';

export const useChat = () => {
  const { token } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchChats = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch(`${SERVER_PATH}/chat`, {
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
      const response = await fetch(`${SERVER_PATH}/chat/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentChat(data);
      } else if (response.status === 404) {
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
  }, [token]);

  const createChat = useCallback(async (request: CreateChatRequest): Promise<string | null> => {
    if (!token) return null;

    try {
      const response = await fetch(`${SERVER_PATH}/chat`, {
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
        return data.id;
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

  const sendMessage = useCallback(async (chatId: string, request: SendMessageRequest): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await fetch(`${SERVER_PATH}/chat/${chatId}`, {
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

  const deleteChat = useCallback(async (chatId: string): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await fetch(`${SERVER_PATH}/chat/${chatId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        await fetchChats(); // Refresh chat list
        if (currentChat?.id === chatId) {
          setCurrentChat(null);
        }
        toast({
          title: "Chat deletado",
          description: "Chat removido com sucesso.",
        });
        return true;
      } else {
        toast({
          title: "Erro ao deletar chat",
          description: "Não foi possível deletar o chat.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
      return false;
    }
  }, [token, fetchChats, currentChat]);

  return {
    chats,
    currentChat,
    loading,
    fetchChats,
    fetchChat,
    createChat,
    sendMessage,
    deleteChat,
    setCurrentChat,
  };
};
