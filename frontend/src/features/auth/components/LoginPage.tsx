import { useState } from 'react';
import { useNavigate, Link as LinkTo } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { useSearchParams } from 'react-router-dom';
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
import { GraduationCap, Loader2, AlertCircle, LogIn } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [codigo, setCodigo] = useState('');
  const [rm, setRm] = useState('');
  const [nome, setNome] = useState('');
  const [isLiderLogin, setIsLiderLogin] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, error } = useAppSelector((s) => s.auth);
  const redirect = searchParams.get('redirect');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const salaResult = await dispatch(acessarSala(codigo)).unwrap();

      if (isLiderLogin) {
        dispatch(setLider(true));
        const alunoData = { id: 0, nome, rm };
        localStorage.setItem('aluno', JSON.stringify(alunoData));
        toast.success('Login realizado com sucesso!');
        navigate(redirect || '/lider');
        return;
      }

      await dispatch(solicitarEntrada({ salaId: salaResult.id, rm, nome })).unwrap();
      toast.success('Solicitação enviada! Aguarde aprovação.');
      navigate(redirect || '/aguardando');
    } catch (err) {
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <LinkTo to="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
            <GraduationCap className="h-10 w-10 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-800">LISTA de TAREFAS FATEC</h1>
          </LinkTo>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <LogIn className="h-10 w-10 text-blue-500" />
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

            <div className="mt-4 text-center">
              <LinkTo to="/" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                Voltar para a página inicial
              </LinkTo>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
