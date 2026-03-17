import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, KeyRound } from 'lucide-react';
import { adminApi, adminStorage } from '@/lib/adminApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PageTransition } from '@/components/layout/PageTransition';

export function AdminLogin() {
  const navigate = useNavigate();
  const [codigoSala, setCodigoSala] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await adminApi.login({ codigoSala, senha });

      if (response.autenticado) {
        adminStorage.saveSession({
          salaId: response.salaId,
          nomeSala: response.nomeSala,
          semestre: response.semestre,
          senha: senha,
        });

        toast.success(`Bem-vindo ao painel de ${response.nomeSala}!`);
        navigate(`/admin/${response.salaId}`);
      } else {
        toast.error('Senha inválida');
      }
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique código da sala e senha.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-in-fade-in-up">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Painel Admin
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Acesse o painel de administração da sua sala
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="codigoSala" className="text-slate-700 dark:text-slate-300 font-semibold">
                  Código da Sala
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="codigoSala"
                    type="text"
                    placeholder="Digite o código da sala"
                    value={codigoSala}
                    onChange={(e) => setCodigoSala(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-700 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha" className="text-slate-700 dark:text-slate-300 font-semibold">
                  Senha do Líder
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Digite a senha da sala"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-700 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar no Painel'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Precisa de ajuda? Entre em contato com o suporte.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
