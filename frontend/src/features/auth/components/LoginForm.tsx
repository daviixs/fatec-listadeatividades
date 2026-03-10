import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { acessarSala, solicitarEntrada, setLider } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Loader2, AlertCircle } from 'lucide-react';

export default function LoginForm() {
  const [codigo, setCodigo] = useState('');
  const [rm, setRm] = useState('');
  const [nome, setNome] = useState('');
  const [isLiderLogin, setIsLiderLogin] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Acessar sala pelo código
      const salaResult = await dispatch(acessarSala(codigo)).unwrap();

      if (isLiderLogin) {
        // Login como líder - vai direto para o dashboard do líder
        dispatch(setLider(true));
        // Definir um aluno fake para o líder (representante)
        const alunoData = { id: 0, nome, rm };
        localStorage.setItem('aluno', JSON.stringify(alunoData));
        navigate('/lider');
        return;
      }

      // 2. Solicitar entrada na sala como aluno
      await dispatch(
        solicitarEntrada({ salaId: salaResult.id, rm, nome })
      ).unwrap();

      // 3. Redirecionar para aguardando aprovação
      navigate('/aguardando');
    } catch {
      // Erro já tratado pelo Redux/interceptor
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <GraduationCap className="h-10 w-10 text-blue-500" />
        </div>
        <CardTitle className="text-2xl">Entrada na Sala</CardTitle>
        <CardDescription>
          Digite o código da sala e seus dados para entrar
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="codigo">Código da Sala</Label>
            <Input
              id="codigo"
              placeholder="Digite o código de convite"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rm">RM</Label>
            <Input
              id="rm"
              placeholder="Digite seu RM"
              value={rm}
              onChange={(e) => setRm(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isLider"
              checked={isLiderLogin}
              onChange={(e) => setIsLiderLogin(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isLider" className="text-sm text-muted-foreground cursor-pointer">
              Entrar como Líder
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
