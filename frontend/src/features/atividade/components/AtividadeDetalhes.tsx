import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchAtividade } from '@/features/atividade/atividadesSlice';
import { fetchVotacao } from '@/features/atividade/votacaoSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  BookOpen,
  User,
  ExternalLink,
  FileText,
  ArrowLeft,
  Vote,
} from 'lucide-react';

export default function AtividadeDetalhes() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { atividade, loading } = useAppSelector((s) => s.atividades);
  const { votacao } = useAppSelector((s) => s.votacao);

  useEffect(() => {
    if (id) {
      dispatch(fetchAtividade(Number(id)));
      dispatch(fetchVotacao(Number(id)));
    }
  }, [dispatch, id]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  if (loading || !atividade) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Card>
          <CardContent className="space-y-3 pt-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl">{atividade.titulo}</CardTitle>
            <Badge
              variant={
                atividade.status === 'ATIVA' ? 'default' : 'destructive'
              }
              className={
                atividade.status === 'ATIVA'
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : ''
              }
            >
              {atividade.status}
            </Badge>
          </div>
          {atividade.materiaNome && (
            <CardDescription className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {atividade.materiaNome}
              {atividade.professorNome && (
                <>
                  <span className="text-gray-300">|</span>
                  <User className="h-3 w-3" />
                  {atividade.professorNome}
                </>
              )}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Descrição */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              Descrição
            </h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {atividade.descricao}
            </p>
          </div>

          <Separator />

          {/* Tipo de entrega */}
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Tipo de Entrega:</span>
            <Badge variant="outline">
              {atividade.tipoEntrega === 'LINK_EXTERNO'
                ? 'Link Externo'
                : 'Entrega Manual'}
            </Badge>
          </div>

          {/* Link de entrega */}
          {atividade.tipoEntrega === 'LINK_EXTERNO' && atividade.linkEntrega && (
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-blue-500" />
              <a
                href={atividade.linkEntrega}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                {atividade.linkEntrega}
              </a>
            </div>
          )}

          {/* Regras de entrega */}
          {atividade.regrasEntrega && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                Regras de Entrega
              </h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {atividade.regrasEntrega}
              </p>
            </div>
          )}

          <Separator />

          {/* Prazo */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Prazo:</span>
            <span className="text-sm">{formatDate(atividade.prazo)}</span>
          </div>

          {/* Card de votação */}
          {votacao && (
            <>
              <Separator />
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Vote className="h-4 w-4 text-blue-500" />
                    Votação de Cancelamento
                  </CardTitle>
                  <CardDescription>
                    {votacao.status === 'ABERTA'
                      ? `Encerra em: ${new Date(votacao.encerraEm).toLocaleString('pt-BR')}`
                      : 'Votação encerrada'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>
                      SIM: {votacao.votosSim} | NÃO: {votacao.votosNao}
                    </span>
                    <span className="text-muted-foreground">
                      Meta: {votacao.metaCancelamento}
                    </span>
                  </div>
                  <Progress
                    value={
                      votacao.metaCancelamento > 0
                        ? (votacao.votosSim / votacao.metaCancelamento) * 100
                        : 0
                    }
                    className="h-2"
                  />

                  {votacao.status === 'ABERTA' && (
                    <Button
                      className="w-full"
                      onClick={() =>
                        navigate(`/atividades/${atividade.id}/votar`)
                      }
                    >
                      <Vote className="h-4 w-4 mr-2" />
                      Votar
                    </Button>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
