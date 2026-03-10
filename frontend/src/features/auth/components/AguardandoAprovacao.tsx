import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { verificarEntrada } from '@/features/auth/authSlice';
import { usePolling } from '@/hooks/usePolling';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function AguardandoAprovacao() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { salaId, entradaId, entradaStatus } = useAppSelector((s) => s.auth);

  // Polling a cada 10 segundos
  usePolling(
    () => {
      if (salaId && entradaId && entradaStatus === 'PENDENTE') {
        dispatch(verificarEntrada({ salaId, entradaId }));
      }
    },
    10000,
    entradaStatus === 'PENDENTE'
  );

  // Redirecionar quando aprovado
  useEffect(() => {
    if (entradaStatus === 'APROVADO') {
      const timer = setTimeout(() => navigate('/aluno'), 2000);
      return () => clearTimeout(timer);
    }
  }, [entradaStatus, navigate]);

  // Se não tem entradaId, voltar para login
  useEffect(() => {
    if (!entradaId) {
      navigate('/');
    }
  }, [entradaId, navigate]);

  const handleAtualizar = () => {
    if (salaId && entradaId) {
      dispatch(verificarEntrada({ salaId, entradaId }));
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="text-center">
        {entradaStatus === 'PENDENTE' && (
          <>
            <div className="flex justify-center mb-2">
              <Clock className="h-10 w-10 text-amber-500" />
            </div>
            <CardTitle className="text-xl">Aguardando Aprovação</CardTitle>
            <CardDescription>
              Sua solicitação de entrada foi enviada com sucesso!
            </CardDescription>
          </>
        )}

        {entradaStatus === 'APROVADO' && (
          <>
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-10 w-10 text-emerald-500" />
            </div>
            <CardTitle className="text-xl text-emerald-600">
              Aprovação Concedida!
            </CardTitle>
            <CardDescription>Redirecionando para a sala...</CardDescription>
          </>
        )}

        {entradaStatus === 'REJEITADO' && (
          <>
            <div className="flex justify-center mb-2">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
            <CardTitle className="text-xl text-red-600">
              Solicitação Rejeitada
            </CardTitle>
            <CardDescription>
              Sua solicitação foi rejeitada pelo líder da sala.
            </CardDescription>
          </>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {entradaStatus === 'PENDENTE' && (
          <>
            <div className="text-center">
              <Badge variant="outline" className="border-amber-500 text-amber-600">
                Pendente
              </Badge>
              <p className="mt-3 text-sm text-muted-foreground">
                Aguarde a aprovação do líder para acessar a sala.
                A verificação é feita automaticamente a cada 10 segundos.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleAtualizar}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar Status
            </Button>
          </>
        )}

        {entradaStatus === 'APROVADO' && (
          <div className="text-center">
            <Badge className="bg-emerald-500">Aprovado</Badge>
            <p className="mt-3 text-sm text-muted-foreground">
              Você será redirecionado automaticamente em instantes...
            </p>
          </div>
        )}

        {entradaStatus === 'REJEITADO' && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Tela Inicial
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
