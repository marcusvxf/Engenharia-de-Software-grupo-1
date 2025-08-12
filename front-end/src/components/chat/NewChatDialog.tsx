
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useChat } from '@/hooks/useChat';

interface NewChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChatCreated: (chatId: string) => void;
}

export const NewChatDialog = ({ open, onOpenChange, onChatCreated }: NewChatDialogProps) => {
  const { createChat, sendMessage, fetchChats } = useChat();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    console.log('🚀 NewChatDialog: Criando chat com pergunta:', question.trim());
    
    try {
      // 1. Criar o chat
      const chatId = await createChat(question.trim());
      
      if (chatId) {
        console.log('✅ NewChatDialog: Chat criado com ID:', chatId);
        
        // 2. Enviar a primeira mensagem automaticamente
        console.log('📤 NewChatDialog: Enviando primeira mensagem...');
        const messageSuccess = await sendMessage(chatId, question.trim());
        
        if (messageSuccess) {
          console.log('✅ NewChatDialog: Primeira mensagem enviada com sucesso');
        } else {
          console.log('❌ NewChatDialog: Erro ao enviar primeira mensagem');
        }
        
        // Forçar atualização da lista de chats
        console.log('🔄 NewChatDialog: Atualizando lista de chats...');
        await fetchChats();
        
        setQuestion('');
        onOpenChange(false);
        onChatCreated(chatId);
      }
    } catch (error) {
      console.error('❌ NewChatDialog: Erro no processo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Conversa</DialogTitle>
          <DialogDescription>
            Digite sua primeira pergunta para iniciar uma nova conversa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Pergunta inicial</Label>
            <Textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta..."
              className="min-h-[100px] resize-none"
              disabled={loading}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!question.trim() || loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Criando e enviando...' : 'Iniciar Conversa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
