import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, FileText, Edit, Trash2 } from 'lucide-react';
import { adminApi } from '@/lib/adminApi';
import type { Atividade } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageTransition } from '@/components/layout/PageTransition';
import { toast } from 'sonner';

export function AdminProvas() {
  const { salaId } = useParams<{ salaId: string }>();
  const [provas, setProvas] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProvas();
  }, [salaId]);

  const loadProvas = async () => {
    try {
      const data = await adminApi.getProvas(Number(salaId));
      setProvas(data);
    } catch (error) {
      toast.error('Erro ao carregar provas');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta prova?')) return;
    try {
      await adminApi.excluirAtividade(Number(salaId), id);
      toast.success('Prova excluída com sucesso!');
      loadProvas();
    } catch (error) {
      toast.error('Erro ao excluir prova');
    }
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
      <div className="animate-in-fade-in space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Provas
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Gerencie todas as provas da sala
          </p>
        </div>

        {provas.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Nenhuma prova cadastrada
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Você ainda não possui provas registradas nesta sala.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {provas.map((prova) => (
              <Card key={prova.id} className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => handleExcluir(prova.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                    {prova.titulo}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                    {prova.descricao}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">{prova.materiaNome}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">
                        {new Date(prova.prazo).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
