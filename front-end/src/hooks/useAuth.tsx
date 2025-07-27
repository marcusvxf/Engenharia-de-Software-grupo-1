
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginCredentials, RegisterCredentials, ResetPasswordCredentials } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  resetPassword: (credentials: ResetPasswordCredentials) => Promise<boolean>;
  logout: () => void;
  deleteAccount: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SERVER_PATH = import.meta.env.VITE_SERVER_PATH || 'http://localhost:3001';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          user,
          token,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    // Verificação especial para usuário de teste
    if (credentials.email === '1@1.com') {
      const testUser: User = {
        id: 'test-user',
        email: '1@1.com',
        name: 'Usuário de Teste'
      };
      
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify(testUser));
      
      setAuthState({
        user: testUser,
        token: 'test-token',
        isAuthenticated: true,
      });
      
      toast({
        title: "Login de teste realizado!",
        description: "Acesso liberado para usuário de teste.",
      });
      
      return true;
    }

    try {
      const response = await fetch(`${SERVER_PATH}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, user } = data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setAuthState({
          user,
          token,
          isAuthenticated: true,
        });
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao CIn Chat.",
        });
        
        return true;
      } else {
        const errorData = await response.json();
        toast({
          title: "Erro no login",
          description: errorData.message || "Credenciais inválidas.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    if (!credentials.email.endsWith('@cin.ufpe.br')) {
      toast({
        title: "Email inválido",
        description: "Use um email @cin.ufpe.br para se registrar.",
        variant: "destructive",
      });
      return false;
    }

    if (credentials.password !== credentials.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas não são iguais.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await fetch(`${SERVER_PATH}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          action: 'register'
        }),
      });

      if (response.status === 201) {
        toast({
          title: "Cadastro realizado!",
          description: "Conta criada com sucesso. Faça login para continuar.",
        });
        return true;
      } else {
        const errorData = await response.json();
        toast({
          title: "Erro no cadastro",
          description: errorData.message || "Erro ao criar conta.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Register error:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
      return false;
    }
  };

  const resetPassword = async (credentials: ResetPasswordCredentials): Promise<boolean> => {
    try {
      const response = await fetch(`${SERVER_PATH}/auth`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        toast({
          title: "Senha alterada!",
          description: "Sua senha foi atualizada com sucesso.",
        });
        return true;
      } else {
        const errorData = await response.json();
        toast({
          title: "Erro ao alterar senha",
          description: errorData.message || "Erro ao alterar senha.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const deleteAccount = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${SERVER_PATH}/auth`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        logout();
        toast({
          title: "Conta deletada",
          description: "Sua conta foi removida com sucesso.",
        });
        return true;
      } else {
        toast({
          title: "Erro ao deletar conta",
          description: "Não foi possível deletar sua conta.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Delete account error:', error);
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        resetPassword,
        logout,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
