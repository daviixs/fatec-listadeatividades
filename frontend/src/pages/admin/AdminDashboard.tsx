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
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="faixa-label">Painel Admin / Sala {salaId}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">Status e ações imediatas</h1>
          <div className="divider-strong" />
          <p className="text-sm font-mono text-ink/80">Controle de atividades, provas e pendências.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <Card className="bg-ink text-paper">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <FileText className="w-7 h-7" />
                <span className="text-3xl font-extrabold brutal-num">{stats.total}</span>
              </div>
              <p className="text-xs uppercase tracking-[0.1em] font-mono">Total de atividades</p>
            </CardContent>
          </Card>

          <Card className="bg-accent text-ink">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <Clock className="w-7 h-7" />
                <span className="text-3xl font-extrabold brutal-num">{stats.pendentes}</span>
              </div>
              <p className="text-xs uppercase tracking-[0.1em] font-mono">Pendentes</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <CheckCircle className="w-7 h-7" />
                <span className="text-3xl font-extrabold brutal-num">{stats.aprovadas}</span>
              </div>
              <p className="text-xs uppercase tracking-[0.1em] font-mono">Aprovadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <Calendar className="w-7 h-7" />
                <span className="text-3xl font-extrabold brutal-num">{stats.provas}</span>
              </div>
              <p className="text-xs uppercase tracking-[0.1em] font-mono">Provas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          <Card>
            <CardContent className="p-4 sm:p-5 space-y-3">
              <h3 className="text-lg font-extrabold">Ações rápidas</h3>
              <Button
                onClick={() => navigate(`/admin/${salaId}/atividades`)}
                className="w-full justify-between"
              >
                Gerenciar Atividades <FileText className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => navigate(`/admin/${salaId}/provas`)}
                variant="secondary"
                className="w-full justify-between"
              >
                Gerenciar Provas <Calendar className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {stats.pendentes > 0 && (
            <Card className="bg-alert text-paper">
              <CardContent className="p-4 sm:p-5 space-y-3">
                <h3 className="text-lg font-extrabold">Atenção: pendências</h3>
                <p className="text-sm font-mono">
                  {stats.pendentes} atividade(s) aguardando aprovação. Trate agora para manter o calendário limpo.
                </p>
                <Button
                  onClick={() => navigate(`/admin/${salaId}/atividades`)}
                  variant="outline"
                  className="bg-paper text-ink"
                >
                  Revisar pendentes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
