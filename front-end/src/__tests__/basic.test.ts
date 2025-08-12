// Testes básicos para verificar se Jest está funcionando

describe('Testes Básicos da Aplicação', () => {
  it('deve somar números corretamente', () => {
    expect(2 + 2).toBe(4);
  });

  it('deve verificar strings', () => {
    const appName = 'CIn Chat';
    expect(appName).toBe('CIn Chat');
    expect(appName.length).toBeGreaterThan(0);
  });

  it('deve trabalhar com arrays', () => {
    const features = ['login', 'chat', 'registro'];
    expect(features).toHaveLength(3);
    expect(features).toContain('login');
  });

  it('deve trabalhar com objetos', () => {
    const user = {
      email: 'test@cin.ufpe.br',
      isAuthenticated: false
    };
    
    expect(user.email).toBe('test@cin.ufpe.br');
    expect(user.isAuthenticated).toBe(false);
    expect(user).toHaveProperty('email');
  });

  it('deve testar funções', () => {
    const validateEmail = (email: string) => email.includes('@cin.ufpe.br');
    
    expect(validateEmail('test@cin.ufpe.br')).toBe(true);
    expect(validateEmail('test@gmail.com')).toBe(false);
  });

  it('deve testar promises', async () => {
    const mockApiCall = () => Promise.resolve({ status: 'success' });
    
    const result = await mockApiCall();
    expect(result.status).toBe('success');
  });

  it('deve testar mock functions', () => {
    const mockFn = jest.fn();
    mockFn('test');
    
    expect(mockFn).toHaveBeenCalled();
    expect(mockFn).toHaveBeenCalledWith('test');
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
