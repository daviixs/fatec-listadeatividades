import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import {
  fetchVotacao,
  registrarVoto,
  limparVotacao,
} from '@/features/atividade/votacaoSlice';
import { usePolling } from '@/hooks/usePolling';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

export default function VotacaoPage() {
  const { atividadeId } = useParams<{ atividadeId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { votacao, loading, votando, votoRegistrado } = useAppSelector(
    (s) => s.votacao
  );
  const { aluno } = useAppSelector((s) => s.auth);

  const pollCallback = useCallback(() => {
    if (atividadeId) {
      dispatch(fetchVotacao(Number(atividadeId)));
    }
  }, [dispatch, atividadeId]);

  // Polling a cada 5 segundos
  usePolling(
    pollCallback,
    5000,
    votacao?.status === 'ABERTA' && !votoRegistrado
  );

  useEffect(() => {
    if (atividadeId) {
      dispatch(fetchVotacao(Number(atividadeId)));
    }
    return () => {
      dispatch(limparVotacao());
    };
  }, [dispatch, atividadeId]);

  const handleVotar = async (opcao: 'SIM' | 'NAO') => {
    if (!atividadeId || !aluno) return;
    await dispatch(
      registrarVoto({
        atividadeId: Number(atividadeId),
        alunoId: aluno.id,
        opcao,
      })
    );
    // Recarregar votação após votar
    dispatch(fetchVotacao(Number(atividadeId)));
  };

  if (loading && !votacao) {
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Card>
          <CardContent className="space-y-3 pt-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!votacao) {
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>Nenhuma votação encontrada para esta atividade.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressoPorcentagem =
    votacao.metaCancelamento > 0
      ? (votacao.votosSim / votacao.metaCancelamento) * 100
      : 0;

  const atividadeCancelada = votacao.atividadeStatus === 'CANCELADA';
  const votacaoEncerrada = votacao.status === 'ENCERRADA';

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar
      </Button>

      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {votacao.atividadeTitulo || 'Votação de Cancelamento'}
          </CardTitle>
          <CardDescription className="flex items-center justify-center gap-1">
            <Clock className="h-3 w-3" />
            Votação aberta de{' '}
            {new Date(votacao.iniciadaEm).toLocaleString('pt-BR')} até{' '}
            {new Date(votacao.encerraEm).toLocaleString('pt-BR')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status da atividade */}
          {atividadeCancelada && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription className="font-semibold">
                Esta atividade foi CANCELADA!
              </AlertDescription>
            </Alert>
          )}

          {votacaoEncerrada && !atividadeCancelada && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Votação encerrada sem cancelamento da atividade.
              </AlertDescription>
            </Alert>
          )}

          {votoRegistrado && (
            <Alert className="border-emerald-500 bg-emerald-50">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <AlertDescription className="text-emerald-700">
                Voto registrado com sucesso!
              </AlertDescription>
            </Alert>
          )}

          {/* Meta de cancelamento */}
          <div className="space-y-2">
            <p className="text-sm text-center text-muted-foreground">
              Atividade será cancelada se{' '}
              <span className="font-semibold">
                {votacao.votosSim} &gt;= {votacao.metaCancelamento}
              </span>{' '}
              de {votacao.totalAlunos} alunos
            </p>

            <Progress
              value={Math.min(progressoPorcentagem, 100)}
              className="h-4"
            />

            <p className="text-center text-sm font-medium">
              {Math.round(Math.min(progressoPorcentagem, 100))}%
            </p>
          </div>

          {/* Contadores de votos */}
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {votacao.votosSim}
              </div>
              <p className="text-sm text-muted-foreground">Votos SIM</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500">
                {votacao.votosNao}
              </div>
              <p className="text-sm text-muted-foreground">Votos NÃO</p>
            </div>
          </div>

          {/* Botões de votação */}
          {!atividadeCancelada && !votacaoEncerrada && !votoRegistrado && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={() => handleVotar('SIM')}
                disabled={votando}
              >
                {votando ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ThumbsUp className="h-5 w-5 mr-2" />
                    VOTAR SIM
                  </>
                )}
              </Button>

              <Button
                size="lg"
                variant="secondary"
                onClick={() => handleVotar('NAO')}
                disabled={votando}
              >
                {votando ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <ThumbsDown className="h-5 w-5 mr-2" />
                    VOTAR NÃO
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Status badge */}
          <div className="flex justify-center">
            <Badge
              variant={
                votacao.status === 'ABERTA' ? 'default' : 'secondary'
              }
              className={
                votacao.status === 'ABERTA'
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : ''
              }
            >
              {votacao.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
