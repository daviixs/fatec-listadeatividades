import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck } from 'lucide-react';
import { masterAdminApi, masterAdminStorage } from '@/lib/masterAdminApi';
import type { MasterAdminLoginRequest } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PageTransition } from '@/components/layout/PageTransition';

export function MasterAdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await masterAdminApi.login({ username, password });
      masterAdminStorage.saveSession({ token: response.token, username: response.username });
      toast.success('Tudo certo. Você entrou na área geral.');
      navigate('/master-admin/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Não foi possível entrar. Confira seus dados.');
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
              <div className="w-20 h-20 bg-gradient-to-br from-[#5A7C7A] to-[#8FA7A5] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-primary-700 mb-2">
                Acesso geral
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Entre para acompanhar salas, atividades e avisos em um só lugar.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-700 dark:text-slate-300 font-semibold">
                  Usuário
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Digite o usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-700 focus:border-[#5A7C7A]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-semibold">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite a senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-700 focus:border-[#5A7C7A]"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-[#5A7C7A] to-[#6B9B7A] hover:from-[#3D5655] hover:to-[#5A8A69] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Acesso reservado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
