import { User, AuthState, LoginCredentials, RegisterCredentials } from '../auth';

describe('Auth Types', () => {
  describe('User interface', () => {
    it('deve aceitar usuário com email obrigatório', () => {
      const user: User = {
        email: 'test@cin.ufpe.br'
      };
      expect(user.email).toBe('test@cin.ufpe.br');
      expect(user.name).toBeUndefined();
    });

    it('deve aceitar usuário com email e nome', () => {
      const user: User = {
        email: 'test@cin.ufpe.br',
        name: 'Usuário de Teste'
      };
      expect(user.email).toBe('test@cin.ufpe.br');
      expect(user.name).toBe('Usuário de Teste');
    });
  });

  describe('AuthState interface', () => {
    it('deve representar estado não autenticado', () => {
      const authState: AuthState = {
        user: null,
        token: null,
        isAuthenticated: false
      };
      expect(authState.isAuthenticated).toBe(false);
      expect(authState.user).toBeNull();
      expect(authState.token).toBeNull();
    });

    it('deve representar estado autenticado', () => {
      const authState: AuthState = {
        user: { email: 'test@cin.ufpe.br', name: 'Test User' },
        token: 'jwt-token',
        isAuthenticated: true
      };
      expect(authState.isAuthenticated).toBe(true);
      expect(authState.user).toBeDefined();
      expect(authState.token).toBe('jwt-token');
    });
  });

  describe('LoginCredentials interface', () => {
    it('deve aceitar credenciais válidas', () => {
      const credentials: LoginCredentials = {
        email: 'test@cin.ufpe.br',
        password: 'password123'
      };
      expect(credentials.email).toBe('test@cin.ufpe.br');
      expect(credentials.password).toBe('password123');
    });
  });

  describe('RegisterCredentials interface', () => {
    it('deve aceitar credenciais de registro válidas', () => {
      const credentials: RegisterCredentials = {
        name: 'Usuário de Teste',
        email: 'test@cin.ufpe.br',
        password: 'password123',
        confirmPassword: 'password123'
      };
      expect(credentials.name).toBe('Usuário de Teste');
      expect(credentials.email).toBe('test@cin.ufpe.br');
      expect(credentials.password).toBe('password123');
      expect(credentials.confirmPassword).toBe('password123');
    });
  });
});
