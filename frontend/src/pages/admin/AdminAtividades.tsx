import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusCircle, Check, X, Edit, Trash2, Filter } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import type { Atividade } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PageTransition } from '@/components/layout/PageTransition';
import { toast } from 'sonner';

export function AdminAtividades() {
  const { salaId } = useParams<{ salaId: string }>();
  const navigate = useNavigate();
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [pendentes, setPendentes] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todas');

  useEffect(() => {
    loadData();
  }, [salaId]);

  const loadData = async () => {
    try {
      const [todas, pend] = await Promise.all([
        adminApi.getAtividadesPorSala(Number(salaId)),
        adminApi.getAtividadesPendentes(Number(salaId)),
      ]);
      setAtividades(todas);
      setPendentes(pend);
    } catch (error) {
      toast.error('Não foi possível carregar as atividades.');
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (id: number) => {
    try {
      await adminApi.aprovarAtividade(Number(salaId), id);
      toast.success('Atividade aprovada.');
      loadData();
    } catch (error) {
      toast.error('Não foi possível aprovar a atividade.');
    }
  };

  const handleRejeitar = async (id: number) => {
    try {
      await adminApi.rejeitarAtividade(Number(salaId), id);
      toast.success('Atividade não aprovada.');
      loadData();
    } catch (error) {
      toast.error('Não foi possível concluir essa ação.');
    }
  };

  const handleExcluir = async (id: number) => {
    if (!confirm('Quer mesmo apagar esta atividade?')) return;
    try {
      await adminApi.excluirAtividade(Number(salaId), id);
      toast.success('Atividade removida.');
      loadData();
    } catch (error) {
      toast.error('Não foi possível remover a atividade.');
    }
  };

  const getFilteredAtividades = () => {
    switch (activeTab) {
      case 'pendentes':
        return pendentes;
      case 'aprovadas':
        return atividades.filter((a) => a.statusAprovacao === 'APROVADA');
      case 'rejeitadas':
        return atividades.filter((a) => a.statusAprovacao === 'REJEITADA');
      default:
        return atividades;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">Para revisar</Badge>;
      case 'APROVADA':
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">Aprovada</Badge>;
      case 'REJEITADA':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rejeitada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'PROVA':
        return <Badge variant="outline" className="border-slate-400 text-slate-700 dark:text-slate-300">Prova</Badge>;
      case 'TRABALHO':
        return <Badge variant="outline" className="border-slate-400 text-slate-700 dark:text-slate-300">Trabalho</Badge>;
      default:
        return <Badge variant="outline">Atividade</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-600 border-t-transparent"></div>
      </div>
    );
  }

  const filtered = getFilteredAtividades();

  return (
    <PageTransition>
      <div className="animate-in-fade-in space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Atividades
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Veja tudo o que foi enviado para esta sala.
            </p>
          </div>
          <Button
            onClick={() => navigate(`/admin/${salaId}/atividades/nova`)}
            className="w-full sm:w-auto bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg"
          >
            <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="text-sm sm:text-base">Adicionar atividade</span>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-slate-100 dark:bg-slate-800 w-full sm:w-auto overflow-x-auto">
            <TabsTrigger value="todas" className="text-sm">Todas ({atividades.length})</TabsTrigger>
            <TabsTrigger value="pendentes" className="text-sm">Para revisar ({pendentes.length})</TabsTrigger>
            <TabsTrigger value="aprovadas" className="text-sm">Aprovadas</TabsTrigger>
            <TabsTrigger value="rejeitadas" className="text-sm">Não aprovadas</TabsTrigger>
          </TabsList>

          {filtered.length === 0 ? (
            <Card>
              <CardContent className="p-8 sm:p-12 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">Nada por aqui ainda.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filtered.map((atividade) => (
                <Card key={atividade.id} className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-slate-900 line-clamp-1">
                            {atividade.titulo}
                          </h3>
                          {getStatusBadge(atividade.statusAprovacao)}
                          {getTipoBadge(atividade.tipo)}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                          {atividade.descricao}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          <span>📚 {atividade.materiaNome}</span>
                          <span>📅 Prazo: {new Date(atividade.prazo).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {atividade.statusAprovacao === 'PENDENTE' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleAprovar(atividade.id)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white h-9 w-9 sm:w-auto sm:px-3"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleRejeitar(atividade.id)}
                              className="bg-red-500 hover:bg-red-600 text-white h-9 w-9 sm:w-auto sm:px-3"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/${salaId}/atividades/${atividade.id}/editar`)}
                          className="h-9 w-9 sm:w-auto sm:px-3"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExcluir(atividade.id)}
                          className="h-9 w-9 sm:w-auto sm:px-3"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </Tabs>
      </div>
    </PageTransition>
  );
}
