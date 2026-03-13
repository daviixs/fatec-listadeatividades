import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchAtividades } from '@/features/atividade/atividadesSlice';
import { fetchMaterias } from '@/features/aluno/materiasSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardList, Calendar, ArrowRight } from 'lucide-react';

export default function AtividadesLista() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filtroMateria, setFiltroMateria] = useState<string>(
    searchParams.get('materiaId') || 'todas'
  );
  const [filtroStatus, setFiltroStatus] = useState<string>('todas');

  const { salaId } = useAppSelector((s) => s.auth);
  const { lista: atividades, loading } = useAppSelector((s) => s.atividades);
  const { lista: materias } = useAppSelector((s) => s.materias);

  useEffect(() => {
    dispatch(fetchAtividades());
    if (salaId) {
      dispatch(fetchMaterias(salaId));
    }
  }, [dispatch, salaId]);

  const atividadesFiltradas = atividades.filter((a) => {
    const matchMateria =
      filtroMateria === 'todas' || a.materiaId === Number(filtroMateria);
    const matchStatus =
      filtroStatus === 'todas' || a.status === filtroStatus;
    return matchMateria && matchStatus;
  });

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Atividades</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Atividades</h2>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <Select value={filtroMateria} onValueChange={(v) => v && setFiltroMateria(v)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrar por matéria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as matérias</SelectItem>
            {materias.map((m) => (
              <SelectItem key={m.id} value={String(m.id)}>
                {m.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filtroStatus} onValueChange={(v) => v && setFiltroStatus(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todos os status</SelectItem>
            <SelectItem value="ATIVA">Ativas</SelectItem>
            <SelectItem value="CANCELADA">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {atividadesFiltradas.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <ClipboardList className="h-10 w-10 mx-auto mb-3 text-gray-400" />
            <p>Nenhuma atividade encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {atividadesFiltradas.map((atividade) => (
            <Card key={atividade.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{atividade.titulo}</CardTitle>
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
                <CardDescription className="line-clamp-2">
                  {atividade.descricao}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Prazo: {formatDate(atividade.prazo)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {atividade.tipoEntrega === 'LINK_EXTERNO'
                    ? 'Entrega via link'
                    : 'Entrega manual'}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/atividades/${atividade.id}`)}
                >
                  Ver Detalhes
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
