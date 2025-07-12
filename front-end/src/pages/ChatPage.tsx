
import { useState } from 'react';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { NewChatDialog } from '@/components/chat/NewChatDialog';

export const ChatPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string>();
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);

  const handleNewChat = () => {
    setNewChatDialogOpen(true);
  };

  const handleChatCreated = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setSidebarOpen(false); // Close sidebar on mobile when selecting chat
  };

  return (
    <div className="h-screen flex bg-gray-100">
      <ChatSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        currentChatId={currentChatId}
      />
      
      <ChatInterface chatId={currentChatId} />

      <NewChatDialog
        open={newChatDialogOpen}
        onOpenChange={setNewChatDialogOpen}
        onChatCreated={handleChatCreated}
      />
    </div>
  );
};
