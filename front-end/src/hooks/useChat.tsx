import { useState, useCallback } from 'react';
import { Chat, CreateChatRequest, SendMessageRequest } from '@/types/chat';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

const SERVER_PATH = import.meta.env.VITE_SERVER_PATH || 'http://localhost:3000';

const getUserId = (): string => {
  const storedUserId = localStorage.getItem('userId');
  console.log('👤 getUserId: Valor armazenado:', storedUserId);
  return storedUserId || '';
};

export const useChat = () => {
  const { token } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchChats = useCallback(async () => {
    if (!token) {
      console.log('❌ fetchChats: Token não encontrado');
      return;
    }

    try {
      setLoading(true);
      const userId = getUserId();
      console.log('🔍 fetchChats: Buscando chats para userId:', userId);
      console.log('🔍 fetchChats: URL:', `${SERVER_PATH}/chats/user/${userId}`);
      
      const response = await fetch(`${SERVER_PATH}/chats/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📡 fetchChats: Status da resposta:', response.status);

      if (response.ok) {
        const rawData = await response.json();
        console.log('✅ fetchChats: Dados recebidos:', rawData);
        console.log('📊 fetchChats: Quantidade de chats:', rawData?.length || 0);
        
        // Mapear dados do backend para o formato esperado pelo frontend
        const mappedChats = rawData.map((chat: any) => ({
          id: chat.id.toString(), // Converter ID para string
          name: chat.name,
          createdAt: new Date(chat.created_at), // Converter created_at para createdAt
          userId: chat.userId
        }));
        
        console.log('🔄 fetchChats: Dados mapeados:', mappedChats);
        setChats(mappedChats);
        setRefreshTrigger(prev => prev + 1);
      } else if (response.status === 401) {
        toast({
          title: "Sessão expirada",
          description: "Faça login novamente.",
          variant: "destructive",
        });
      } else {
        console.log('❌ fetchChats: Erro na resposta:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ fetchChats: Erro na requisição:', error);
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
        const rawMessages = await messagesResponse.json();
        console.log('Mensagens brutas do servidor:', rawMessages);
        
        // Mapear mensagens para o formato esperado pelo frontend
        const messages = rawMessages.map((msg: any) => ({
          id: msg.id.toString(),
          text: msg.text,
          isUser: msg.order % 2 === 1, // Mensagens com order ímpar = usuário, par = bot
          createdAt: new Date()
        }));
        
        // Find the chat in the current chats list to get chat info
        const chat = chats.find(c => c.id === chatId);
        if (chat) {
          setCurrentChat({
            ...chat,
            messages: messages
          });
        } else {
          // Se o chat não está na lista (chat novo), criar um temporário
          setCurrentChat({
            id: chatId,
            name: 'Nova Conversa',
            createdAt: new Date(),
            userId: parseInt(getUserId()),
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
        console.log('✅ createChat: Chat criado:', data);
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
      console.log('Enviando mensagem:', { chatId, messageText, serverPath: SERVER_PATH });
      
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
        const data = await response.json();
        console.log('Resposta do sendMessage:', data);
        
        // Atualizar o chat atual com as novas mensagens
        if (data.userMessage && data.botMessage) {
          console.log('Processando mensagens:', { userMessage: data.userMessage, botMessage: data.botMessage });
          
          const userMsg = {
            id: data.userMessage.id.toString(),
            text: data.userMessage.text,
            isUser: true,
            createdAt: new Date()
          };
          
          const botMsg = {
            id: data.botMessage.id.toString(),
            text: data.botMessage.text,
            isUser: false,
            createdAt: new Date()
          };

          console.log('Mensagens formatadas:', { userMsg, botMsg });

          setCurrentChat(prev => {
            // Se não há chat atual, criar um temporário com as mensagens
            if (!prev) {
              const tempChat = {
                id: chatId,
                name: 'Chat',
                createdAt: new Date(),
                userId: parseInt(getUserId()),
                messages: [userMsg, botMsg]
              };
              console.log('Chat temporário criado:', tempChat);
              return tempChat;
            }
            
            const updatedChat = {
              ...prev,
              messages: [...(prev.messages || []), userMsg, botMsg]
            };
            console.log('Chat atualizado:', updatedChat);
            return updatedChat;
          });
        } else {
          console.log('Condições não atendidas:', { 
            currentChat: !!currentChat, 
            userMessage: !!data.userMessage, 
            botMessage: !!data.botMessage,
            data 
          });
        }
        
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
  }, [token, currentChat]);

  return {
    chats,
    currentChat,
    loading,
    fetchChats,
    fetchChat,
    createChat,
    sendMessage,
    setCurrentChat,
    refreshTrigger, // Expor o trigger para debug
  };
};
