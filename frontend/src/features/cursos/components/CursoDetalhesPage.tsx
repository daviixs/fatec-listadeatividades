import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchCursoPorNome } from '@/features/cursos/cursosSlice';
import { cadastrarEmail, verificarEmail, excluirEmail } from '@/features/lembrete/lembreteSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle, Mail, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import CursoCard from './CursoCard';

export default function CursoDetalhesPage() {
  const { cursoNome } = useParams<{ cursoNome: string }>();
  const dispatch = useAppDispatch();
  const { cursoSelecionado, loading } = useAppSelector((s) => s.cursos);
  const { emailCadastrado, loading: loadingEmail } = useAppSelector((s) => s.lembrete);

  const [email, setEmail] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    if (cursoNome) {
      dispatch(fetchCursoPorNome(cursoNome));
    }
  }, [dispatch, cursoNome]);

  useEffect(() => {
    if (cursoNome && emailCadastrado === null) {
      const emailSalvo = localStorage.getItem(`lembrete_${cursoNome}`);
      if (emailSalvo) {
        dispatch(verificarEmail({ email: emailSalvo, cursoNome }));
      }
    }
  }, [dispatch, cursoNome, emailCadastrado]);

  const handleCadastrarEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    try {
      await dispatch(cadastrarEmail({ email: email.trim(), cursoNome: cursoNome || '' })).unwrap();
      localStorage.setItem(`lembrete_${cursoNome}`, email);
      toast.success('Email cadastrado com sucesso!');
      setMostrarFormulario(false);
    } catch {
      toast.error('Erro ao cadastrar email. Tente novamente.');
    }
  };

  const handleRemoverEmail = async () => {
    if (emailCadastrado?.id) {
      try {
        await dispatch(excluirEmail(emailCadastrado.id)).unwrap();
        localStorage.removeItem(`lembrete_${cursoNome}`);
        toast.success('Email removido com sucesso!');
        setEmail(emailCadastrado.email);
        setMostrarFormulario(true);
      } catch {
        toast.error('Erro ao remover email.');
      }
    }
  };

  const cursoInfo = {
    ADS: {
      nome: 'Análise e Desenvolvimento de Sistemas',
      duracao: '6 semestres (3 anos)'
    },
    DSM: {
      nome: 'Desenvolvimento de Software Multiplataforma',
      duracao: '6 semestres (3 anos)'
    },
    GPI: {
      nome: 'Gestão da Produção Industrial',
      duracao: '6 semestres (3 anos)'
    },
    GRH: {
      nome: 'Gestão de Recursos Humanos',
      duracao: '6 semestres (3 anos)'
    }
  };

  const info = cursoInfo[cursoNome?.toUpperCase() as keyof typeof cursoInfo];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          Voltar para cursos
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 flex-1">
          {info?.nome || cursoNome?.toUpperCase()}
        </h1>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500 text-white p-3 rounded-full">
              <Mail className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Para receber o lembrete diário de atividades você deve colocar seu email aqui
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Receba notificações diárias sobre as atividades pendentes deste curso diretamente no seu email.
              </p>

              {emailCadastrado && !mostrarFormulario ? (
                <Alert className="mb-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>
                        Email cadastrado: <strong>{emailCadastrado.email}</strong>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoverEmail}
                        disabled={loadingEmail}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleCadastrarEmail} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="max-w-md"
                    />
                  </div>
                  </form>
                )}

              {!emailCadastrado && (
                <Button
                  onClick={handleCadastrarEmail}
                  disabled={loadingEmail || !email.trim()}
                  className="w-full sm:w-auto"
                >
                  {loadingEmail ? 'Cadastrando...' : 'Cadastrar'}
                  {!loadingEmail && <Send className="ml-2 h-4 w-4" />}
                </Button>
              )}

              {emailCadastrado && !mostrarFormulario && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEmail(emailCadastrado.email);
                    setMostrarFormulario(true);
                  }}
                  className="w-full sm:w-auto"
                >
                  Alterar email
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Selecione o Período</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {cursoNome?.toUpperCase() !== 'DSM' && (
            <Link
              to={`/cursos/${cursoNome}/manha`}
            >
              <CursoCard
                nome="Manhã"
                semestre=""
                onClick={() => {}}
              />
            </Link>
          )}
          <Link
            to={`/cursos/${cursoNome}/noite`}
          >
            <CursoCard
              nome="Noite"
              semestre=""
              onClick={() => {}}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}