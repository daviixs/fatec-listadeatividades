import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Mail, FileText, Users, LogOut, Trash2 } from 'lucide-react';
import { masterAdminApi, masterAdminStorage } from '@/lib/masterAdminApi';
import type { EmailAssinanteResponse, AtividadeAdminResponse, SalaAdminResponse } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageTransition } from '@/components/layout/PageTransition';
import { toast } from 'sonner';

type TabType = 'emails' | 'atividades' | 'salas';

export function MasterAdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('emails');
  const [emails, setEmails] = useState<EmailAssinanteResponse[]>([]);
  const [atividades, setAtividades] = useState<AtividadeAdminResponse[]>([]);
  const [salas, setSalas] = useState<SalaAdminResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<{ id: number; type: string } | null>(null);
  const session = masterAdminStorage.getSession();

  useEffect(() => {
    if (!session) {
      navigate('/master-admin/login');
      return;
    }
    loadData();
  }, [activeTab, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'emails':
          const emailsData = await masterAdminApi.getEmails();
          setEmails(emailsData);
          break;
        case 'atividades':
          const atividadesData = await masterAdminApi.getAtividades();
          setAtividades(atividadesData);
          break;
        case 'salas':
          const salasData = await masterAdminApi.getSalas();
          setSalas(salasData);
          break;
      }
    } catch (error: any) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmail = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este email?')) return;
    setDeleting({ id, type: 'email' });
    try {
      await masterAdminApi.deleteEmail(id);
      setEmails(emails.filter(e => e.id !== id));
      toast.success('Email excluído com sucesso');
    } catch (error: any) {
      toast.error('Erro ao excluir email');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAtividade = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta atividade?')) return;
    setDeleting({ id, type: 'atividade' });
    try {
      await masterAdminApi.deleteAtividade(id);
      setAtividades(atividades.filter(a => a.id !== id));
      toast.success('Atividade excluída com sucesso');
    } catch (error: any) {
      toast.error('Erro ao excluir atividade');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteSala = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta sala e todos os seus dados? Isso é uma ação irreversível!')) return;
    setDeleting({ id, type: 'sala' });
    try {
      await masterAdminApi.deleteSala(id);
      setSalas(salas.filter(s => s.id !== id));
      toast.success('Sala excluída com sucesso');
    } catch (error: any) {
      toast.error('Erro ao excluir sala');
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = async () => {
    try {
      await masterAdminApi.logout();
      masterAdminStorage.clearSession();
      toast.success('Você saiu do painel Super Admin');
      navigate('/master-admin/login');
    } catch (error: any) {
      masterAdminStorage.clearSession();
      navigate('/master-admin/login');
    }
  };

  const stats = {
    emails: emails.length,
    atividades: atividades.length,
    salas: salas.length,
    emailsAtivos: emails.filter(e => e.ativo).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#5A7C7A] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="animate-in-fade-in space-y-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-primary-700 mb-2">
            Painel Super Admin
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Gerenciamento global do sistema
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#5A7C7A] to-[#6B9B7A] text-white border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Mail className="w-8 h-8 opacity-90" />
                <span className="text-3xl font-bold">{stats.emails}</span>
              </div>
              <p className="text-sm font-medium opacity-90">Total de Emails</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#8FA7A5] to-[#B0C5C3] text-white border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-8 h-8 opacity-90" />
                <span className="text-3xl font-bold">{stats.atividades}</span>
              </div>
              <p className="text-sm font-medium opacity-90">Total de Atividades</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#6B9B7A] to-[#8AB89A] text-white border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 opacity-90" />
                <span className="text-3xl font-bold">{stats.salas}</span>
              </div>
              <p className="text-sm font-medium opacity-90">Total de Salas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#7B9B99] to-[#9BBDBA] text-white border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Mail className="w-8 h-8 opacity-90" />
                <span className="text-3xl font-bold">{stats.emailsAtivos}</span>
              </div>
              <p className="text-sm font-medium opacity-90">Emails Ativos</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
          <div className="border-b border-slate-200 dark:border-slate-800">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('emails')}
                className={`flex-1 py-4 px-6 font-semibold transition-all ${
                  activeTab === 'emails'
                    ? 'bg-[#5A7C7A] text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Mail className="w-5 h-5 inline mr-2" />
                Emails
              </button>
              <button
                onClick={() => setActiveTab('atividades')}
                className={`flex-1 py-4 px-6 font-semibold transition-all ${
                  activeTab === 'atividades'
                    ? 'bg-[#5A7C7A] text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-5 h-5 inline mr-2" />
                Atividades
              </button>
              <button
                onClick={() => setActiveTab('salas')}
                className={`flex-1 py-4 px-6 font-semibold transition-all ${
                  activeTab === 'salas'
                    ? 'bg-[#5A7C7A] text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                Salas
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'emails' && (
              <div className="space-y-3">
                {emails.map((email) => (
                  <div
                    key={email.id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-primary-700">{email.email}</p>
                      <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400 mt-1">
                        <span className={email.ativo ? 'text-green-600' : 'text-red-600'}>
                          {email.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                        <span>Cadastrado: {new Date(email.dataCadastro).toLocaleDateString('pt-BR')}</span>
                        {email.ultimoEnvio && (
                          <span>Último envio: {new Date(email.ultimoEnvio).toLocaleDateString('pt-BR')}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDeleteEmail(email.id)}
                      variant="destructive"
                      size="icon"
                      disabled={deleting?.id === email.id && deleting?.type === 'email'}
                      className="h-10 w-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {emails.length === 0 && (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                    Nenhum email cadastrado
                  </p>
                )}
              </div>
            )}

            {activeTab === 'atividades' && (
              <div className="space-y-3">
                {atividades.map((atividade) => (
                  <div
                    key={atividade.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-primary-700 text-lg">{atividade.titulo}</h3>
                        <div className="flex gap-2 text-sm text-slate-600 dark:text-slate-400 mt-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {atividade.tipo}
                          </span>
                          <span className="px-2 py-1 bg-slate-200 text-slate-700 rounded-full text-xs font-medium">
                            {atividade.statusAprovacao}
                          </span>
                          {atividade.salaId && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              Sala {atividade.salaId}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDeleteAtividade(atividade.id)}
                        variant="destructive"
                        size="icon"
                        disabled={deleting?.id === atividade.id && deleting?.type === 'atividade'}
                        className="h-10 w-10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {atividade.descricao}
                    </p>
                    {atividade.prazo && (
                      <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                        Prazo: {new Date(atividade.prazo).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                ))}
                {atividades.length === 0 && (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                    Nenhuma atividade cadastrada
                  </p>
                )}
              </div>
            )}

            {activeTab === 'salas' && (
              <div className="space-y-3">
                {salas.map((sala) => (
                  <div
                    key={sala.id}
                    className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-primary-700 text-lg">{sala.nome}</h3>
                        <div className="flex gap-2 text-sm text-slate-600 dark:text-slate-400 mt-1">
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                            {sala.semestre}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Código: {sala.codigoConvite}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDeleteSala(sala.id)}
                        variant="destructive"
                        size="icon"
                        disabled={deleting?.id === sala.id && deleting?.type === 'sala'}
                        className="h-10 w-10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {salas.length === 0 && (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                    Nenhuma sala cadastrada
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-12 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:border-red-900 dark:text-red-400 font-semibold"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sair do Painel
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
