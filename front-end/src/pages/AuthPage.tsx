
import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

type AuthView = 'login' | 'register';

export const AuthPage = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center p-4">
      {currentView === 'login' && (
        <LoginForm
          onRegister={() => setCurrentView('register')}
        />
      )}
      {currentView === 'register' && (
        <RegisterForm onBack={() => setCurrentView('login')} />
      )}
    </div>
  );
};
