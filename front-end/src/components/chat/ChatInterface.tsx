
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/hooks/useChat';
import { Send, Bot, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatInterfaceProps {
  chatId?: string;
}

export const ChatInterface = ({ chatId }: ChatInterfaceProps) => {
  const { currentChat, loading, fetchChat, sendMessage } = useChat();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) {
      fetchChat(chatId);
    }
  }, [chatId, fetchChat]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !chatId || sending) return;

    setSending(true);
    const success = await sendMessage(chatId, { message: message.trim() });
    
    if (success) {
      setMessage('');
    }
    
    setSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Bem-vindo ao CIn Chat
          </h2>
          <p className="text-gray-500">
            Selecione uma conversa ou inicie uma nova para começar
          </p>
        </div>
      </div>
    );
  }

  if (loading && !currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4" />
          <p className="text-gray-500">Carregando conversa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="border-b bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {currentChat?.title || 'Nova Conversa'}
        </h2>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {currentChat?.messages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!msg.isUser && (
                <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-2xl rounded-lg px-4 py-2 ${
                  msg.isUser
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.isUser ? 'text-red-100' : 'text-gray-500'
                  }`}
                >
                  {format(new Date(msg.timestamp), 'HH:mm', { locale: ptBR })}
                </p>
              </div>

              {msg.isUser && (
                <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex space-x-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 min-h-[48px] max-h-32 resize-none"
              disabled={sending}
            />
            <Button
              type="submit"
              disabled={!message.trim() || sending}
              className="bg-red-600 hover:bg-red-700 px-4"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
