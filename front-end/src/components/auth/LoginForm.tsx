
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onRegister: () => void;
  onForgotPassword: () => void;
}

export const LoginForm = ({ onRegister, onForgotPassword }: LoginFormProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await login({ email, password });
    
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <img 
            src="/lovable-uploads/83276df1-11e6-4fdc-a773-1425d046ab03.png" 
            alt="CIn UFPE" 
            className="h-16 w-auto mx-auto"
          />
        </div>
        <CardTitle className="text-2xl font-bold">Bem-vindo ao CIn Chat</CardTitle>
        <CardDescription>
          Faça login com seu email @cin.ufpe.br
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@cin.ufpe.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <div className="mt-6 text-center space-y-2">
          <Button
            variant="link"
            onClick={onForgotPassword}
            className="text-sm text-muted-foreground"
          >
            Esqueci minha senha
          </Button>
          <div className="text-sm text-muted-foreground">
            Não tem conta?{' '}
            <Button variant="link" onClick={onRegister} className="p-0 h-auto">
              Cadastre-se
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
