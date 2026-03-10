import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchAtividades } from '@/features/atividade/atividadesSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Vote, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import type { VotacaoCancelamento } from '@/types';
import { useState } from 'react';

export default function VotacoesLista() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { lista: atividades, loading } = useAppSelector((s) => s.atividades);
  const [votacoes, setVotacoes] = useState<
    Record<number, VotacaoCancelamento>
  >({});
  const [loadingVotacoes, setLoadingVotacoes] = useState(false);

  useEffect(() => {
    dispatch(fetchAtividades());
  }, [dispatch]);

  // Buscar votações para cada atividade
  useEffect(() => {
    const fetchVotacoes = async () => {
      setLoadingVotacoes(true);
      const map: Record<number, VotacaoCancelamento> = {};
      for (const atividade of atividades) {
        try {
          const res = await api.get<VotacaoCancelamento>(
            `/atividades/${atividade.id}/votacao`
          );
          map[atividade.id] = res.data;
        } catch {
          // Sem votação para essa atividade
        }
      }
      setVotacoes(map);
      setLoadingVotacoes(false);
    };

    if (atividades.length > 0) {
      fetchVotacoes();
    }
  }, [atividades]);

  const votacoesAbertas = Object.entries(votacoes).filter(
    ([, v]) => v.status === 'ABERTA'
  );
  const votacoesEncerradas = Object.entries(votacoes).filter(
    ([, v]) => v.status === 'ENCERRADA'
  );

  if (loading || loadingVotacoes) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Votações</h2>
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const renderVotacaoCard = (
    atividadeId: string,
    votacao: VotacaoCancelamento
  ) => {
    const atividade = atividades.find((a) => a.id === Number(atividadeId));
    if (!atividade) return null;

    const totalVotos = votacao.votosSim + votacao.votosNao;
    const progressoPorcentagem =
      votacao.totalAlunos > 0
        ? (votacao.votosSim / votacao.metaCancelamento) * 100
        : 0;

    return (
      <Card key={atividadeId} className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{atividade.titulo}</CardTitle>
            <Badge
              variant={votacao.status === 'ABERTA' ? 'default' : 'secondary'}
              className={
                votacao.status === 'ABERTA'
                  ? 'bg-blue-500 hover:bg-blue-600'
                  : ''
              }
            >
              {votacao.status}
            </Badge>
          </div>
          <CardDescription>
            Encerra em:{' '}
            {new Date(votacao.encerraEm).toLocaleString('pt-BR')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>
                Votos SIM: {votacao.votosSim} | NÃO: {votacao.votosNao}
              </span>
              <span className="text-muted-foreground">
                {totalVotos}/{votacao.totalAlunos}
              </span>
            </div>
            <Progress
              value={Math.min(progressoPorcentagem, 100)}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              Meta: {votacao.metaCancelamento} votos SIM para cancelar
            </p>
          </div>

          {votacao.status === 'ABERTA' && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate(`/atividades/${atividadeId}/votar`)}
            >
              Votar
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Votações</h2>

      {votacoesAbertas.length === 0 && votacoesEncerradas.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Vote className="h-10 w-10 mx-auto mb-3 text-gray-400" />
            <p>Nenhuma votação encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {votacoesAbertas.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-blue-600">
                Votações Abertas ({votacoesAbertas.length})
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {votacoesAbertas.map(([id, v]) => renderVotacaoCard(id, v))}
              </div>
            </div>
          )}

          {votacoesEncerradas.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-500">
                Votações Encerradas ({votacoesEncerradas.length})
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {votacoesEncerradas.map(([id, v]) =>
                  renderVotacaoCard(id, v)
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
