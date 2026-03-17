import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Calendar, Clock, CheckCircle } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import type { Atividade, AdminSession } from '@/types/admin';
import { adminStorage } from '@/lib/adminApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageTransition } from '@/components/layout/PageTransition';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { salaId } = useParams<{ salaId: string }>();
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const session = adminStorage.getSession() as AdminSession;

  useEffect(() => {
    loadAtividades();
  }, [salaId]);

  const loadAtividades = async () => {
    try {
      const data = await adminApi.getAtividadesPorSala(Number(salaId));
      setAtividades(data);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: atividades.length,
    pendentes: atividades.filter((a: Atividade) => a.statusAprovacao === 'PENDENTE').length,
    aprovadas: atividades.filter((a: Atividade) => a.statusAprovacao === 'APROVADA').length,
    provas: atividades.filter((a: Atividade) => a.tipo === 'PROVA').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="animate-in-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Visão geral do painel de administração
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-8 h-8 opacity-90" />
                <span className="text-3xl font-bold">{stats.total}</span>
              </div>
              <p className="text-sm font-medium opacity-90">Total de Atividades</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 opacity-90" />
                <span className="text-3xl font-bold">{stats.pendentes}</span>
              </div>
              <p className="text-sm font-medium opacity-90">Pendentes de Aprovação</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="w-8 h-8 opacity-90" />
                <span className="text-3xl font-bold">{stats.aprovadas}</span>
              </div>
              <p className="text-sm font-medium opacity-90">Atividades Aprovadas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-8 h-8 opacity-90" />
                <span className="text-3xl font-bold">{stats.provas}</span>
              </div>
              <p className="text-sm font-medium opacity-90">Provas Cadastradas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Ações Rápidas
              </h3>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate(`/admin/${salaId}/atividades`)}
                  className="w-full h-12 justify-start bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Gerenciar Atividades
                </Button>
                <Button
                  onClick={() => navigate(`/admin/${salaId}/provas`)}
                  className="w-full h-12 justify-start bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Gerenciar Provas
                </Button>
              </div>
            </CardContent>
          </Card>

          {stats.pendentes > 0 && (
            <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-4">
                  ⚠️ {stats.pendentes} atividade(s) pendente(s)
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                  Você tem atividades aguardando aprovação. Revise-as o mais breve possível.
                </p>
                <Button
                  onClick={() => navigate(`/admin/${salaId}/atividades`)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Revisar Pendentes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
