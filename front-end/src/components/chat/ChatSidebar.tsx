
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  currentChatId?: string;
}

export const ChatSidebar = ({ 
  isOpen, 
  onToggle, 
  onNewChat, 
  onSelectChat, 
  currentChatId 
}: ChatSidebarProps) => {
  const { userId, logout } = useAuth();
  const { chats, loading, fetchChats, refreshTrigger } = useChat();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userName = localStorage.getItem('name') || '';
  
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Adicionar logs para debug
  useEffect(() => {
    console.log('🔄 ChatSidebar: Lista de chats atualizada:', chats.length, 'chats');
  }, [chats]);

  // Reagir ao refreshTrigger
  useEffect(() => {
    console.log('🔄 ChatSidebar: RefreshTrigger mudou:', refreshTrigger);
  }, [refreshTrigger]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative top-0 left-0 h-full w-80 bg-gray-900 text-white z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${!isOpen && 'md:w-0 md:overflow-hidden'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/83276df1-11e6-4fdc-a773-1425d046ab03.png" 
                alt="CIn UFPE" 
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-bold">CIn Chat</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="md:hidden text-white hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <Button
              onClick={onNewChat}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Conversa
            </Button>
          </div>

          {/* Chat List */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2">
              {loading ? (
                <div className="text-center text-gray-400 py-4">
                  Carregando chats...
                </div>
              ) : chats.length === 0 ? (
                <div className="text-center text-gray-400 py-4">
                  Nenhuma conversa ainda
                </div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`
                      group flex items-center justify-between p-3 rounded-lg cursor-pointer
                      transition-colors duration-200 hover:bg-gray-800
                      ${currentChatId === chat.id.toString() ? 'bg-gray-800' : ''}
                    `}
                    onClick={() => onSelectChat(chat.id.toString())}
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <MessageSquare className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {chat.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {chat.createdAt && !isNaN(new Date(chat.createdAt).getTime()) 
                            ? format(new Date(chat.createdAt), 'dd MMM', { locale: ptBR })
                            : 'Data inválida'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* User Menu */}
          <div className="border-t border-gray-700 p-4">
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-full justify-start text-white hover:bg-gray-800"
              >
                <User className="h-4 w-4 mr-2" />
                {userName || 'Usuário'}
              </Button>
              
              {showUserMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-lg border border-gray-700 py-2">
                  <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full justify-start text-white hover:bg-gray-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="fixed top-4 left-4 z-30 md:hidden bg-gray-900 text-white hover:bg-gray-800"
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}
    </>
  );
};
