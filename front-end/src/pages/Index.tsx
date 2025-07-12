
import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from './AuthPage';
import { ChatPage } from './ChatPage';

const Index = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <ChatPage />;
};

export default Index;
