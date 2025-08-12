
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SERVER_PATH = import.meta.env.VITE_SERVER_PATH || 'http://localhost:3000';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    userId: null,
    token: null,
    userName: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('name');
    
    if (token && userId) {
      try {
        setAuthState({
          userId,
          token,
          userName,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {

    try {
      const response = await fetch(`${SERVER_PATH}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, userId, name } = data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('name', name);

        setAuthState({
          userId,
          token,
          userName: name,
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

    if (credentials.name.length < 8) {
      toast({
        title: "Nome inválido",
        description: "O nome deve ter pelo menos 8 caracteres.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const response = await fetch(`${SERVER_PATH}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          UserType: 'user'
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

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setAuthState({
      userId: null,
      token: null,
      userName: null,
      isAuthenticated: false,
    });
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
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
