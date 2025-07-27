
import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

type AuthView = 'login' | 'register' | 'reset';

export const AuthPage = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center p-4">
      {currentView === 'login' && (
        <LoginForm
          onRegister={() => setCurrentView('register')}
          onForgotPassword={() => setCurrentView('reset')}
        />
      )}
      {currentView === 'register' && (
        <RegisterForm onBack={() => setCurrentView('login')} />
      )}
      {currentView === 'reset' && (
        <ResetPasswordForm onBack={() => setCurrentView('login')} />
      )}
    </div>
  );
};
