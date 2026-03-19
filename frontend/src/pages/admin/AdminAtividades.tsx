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
      toast.error('Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (id: number) => {
    try {
      await adminApi.aprovarAtividade(Number(salaId), id);
      toast.success('Atividade aprovada com sucesso!');
      loadData();
    } catch (error) {
      toast.error('Erro ao aprovar atividade');
    }
  };

  const handleRejeitar = async (id: number) => {
    try {
      await adminApi.rejeitarAtividade(Number(salaId), id);
      toast.success('Atividade rejeitada com sucesso!');
      loadData();
    } catch (error) {
      toast.error('Erro ao rejeitar atividade');
    }
  };

  const handleExcluir = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta atividade?')) return;
    try {
      await adminApi.excluirAtividade(Number(salaId), id);
      toast.success('Atividade excluída com sucesso!');
      loadData();
    } catch (error) {
      toast.error('Erro ao excluir atividade');
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
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">Pendente</Badge>;
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
        return <Badge variant="outline" className="border-purple-500 text-purple-700 dark:text-purple-300">Prova</Badge>;
      case 'TRABALHO':
        return <Badge variant="outline" className="border-blue-500 text-blue-700 dark:text-blue-300">Trabalho</Badge>;
      default:
        return <Badge variant="outline">Atividade</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const filtered = getFilteredAtividades();

  return (
    <PageTransition>
      <div className="animate-in-fade-in space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-700 mb-2">
              Atividades
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Gerencie todas as atividades da sala
            </p>
          </div>
          <Button
            onClick={() => navigate(`/admin/${salaId}/atividades/nova`)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Nova Atividade
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-slate-100 dark:bg-slate-800">
            <TabsTrigger value="todas">Todas ({atividades.length})</TabsTrigger>
            <TabsTrigger value="pendentes">Pendentes ({pendentes.length})</TabsTrigger>
            <TabsTrigger value="aprovadas">Aprovadas</TabsTrigger>
            <TabsTrigger value="rejeitadas">Rejeitadas</TabsTrigger>
          </TabsList>

          {filtered.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-slate-500 dark:text-slate-400">Nenhuma atividade encontrada</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filtered.map((atividade) => (
                <Card key={atividade.id} className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-primary-700">
                            {atividade.titulo}
                          </h3>
                          {getStatusBadge(atividade.statusAprovacao)}
                          {getTipoBadge(atividade.tipo)}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {atividade.descricao}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
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
                              className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleRejeitar(atividade.id)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/${salaId}/atividades/${atividade.id}/editar`)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleExcluir(atividade.id)}
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
