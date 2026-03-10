import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import {
  fetchEntradas,
  aprovarEntrada,
} from '@/features/lider/entradasSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { UserCheck, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

export default function AprovarEntradas() {
  const dispatch = useAppDispatch();
  const { salaId } = useAppSelector((s) => s.auth);
  const { lista: entradas, loading } = useAppSelector((s) => s.entradas);
  const [processando, setProcessando] = useState<number | null>(null);

  useEffect(() => {
    if (salaId) {
      dispatch(fetchEntradas({ salaId }));
    }
  }, [dispatch, salaId]);

  const handleAprovar = async (entradaId: number, aprovado: boolean) => {
    if (!salaId) return;
    setProcessando(entradaId);
    try {
      await dispatch(
        aprovarEntrada({ salaId, entradaId, aprovado })
      ).unwrap();
      toast.success(
        aprovado ? 'Entrada aprovada com sucesso!' : 'Entrada rejeitada.'
      );
    } catch {
      // Erro tratado pelo interceptor
    } finally {
      setProcessando(null);
    }
  };

  const pendentes = entradas.filter((e) => e.status === 'PENDENTE');
  const aprovados = entradas.filter((e) => e.status === 'APROVADO');
  const rejeitados = entradas.filter((e) => e.status === 'REJEITADO');

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  const borderColors = {
    PENDENTE: 'border-l-amber-500',
    APROVADO: 'border-l-emerald-500',
    REJEITADO: 'border-l-red-500',
  };

  const renderEntradaCard = (entrada: (typeof entradas)[0]) => (
    <Card
      key={entrada.id}
      className={`border-l-4 ${borderColors[entrada.status]}`}
    >
      <CardContent className="flex items-center justify-between py-4">
        <div className="space-y-1">
          <p className="font-medium">{entrada.nome}</p>
          <p className="text-sm text-muted-foreground font-mono">
            RM: {entrada.rm}
          </p>
          <p className="text-xs text-muted-foreground">
            Solicitado em: {formatDate(entrada.dataSolicitacao)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {entrada.status === 'PENDENTE' && (
            <>
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600"
                onClick={() => handleAprovar(entrada.id, true)}
                disabled={processando === entrada.id}
              >
                {processando === entrada.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprovar
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleAprovar(entrada.id, false)}
                disabled={processando === entrada.id}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Rejeitar
              </Button>
            </>
          )}

          {entrada.status === 'APROVADO' && (
            <Badge className="bg-emerald-500">Aprovado</Badge>
          )}

          {entrada.status === 'REJEITADO' && (
            <Badge variant="destructive">Rejeitado</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Aprovar Entradas</h2>
        <Badge variant="outline" className="border-amber-500 text-amber-600">
          <Clock className="h-3 w-3 mr-1" />
          {pendentes.length} pendente{pendentes.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <Tabs defaultValue="pendentes">
        <TabsList>
          <TabsTrigger value="pendentes">
            Pendentes ({pendentes.length})
          </TabsTrigger>
          <TabsTrigger value="aprovados">
            Aprovados ({aprovados.length})
          </TabsTrigger>
          <TabsTrigger value="rejeitados">
            Rejeitados ({rejeitados.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes" className="space-y-3 mt-4">
          {loading ? (
            [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : pendentes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <UserCheck className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                <p>Nenhuma solicitação pendente.</p>
              </CardContent>
            </Card>
          ) : (
            pendentes.map(renderEntradaCard)
          )}
        </TabsContent>

        <TabsContent value="aprovados" className="space-y-3 mt-4">
          {aprovados.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <p>Nenhuma entrada aprovada.</p>
              </CardContent>
            </Card>
          ) : (
            aprovados.map(renderEntradaCard)
          )}
        </TabsContent>

        <TabsContent value="rejeitados" className="space-y-3 mt-4">
          {rejeitados.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <p>Nenhuma entrada rejeitada.</p>
              </CardContent>
            </Card>
          ) : (
            rejeitados.map(renderEntradaCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
