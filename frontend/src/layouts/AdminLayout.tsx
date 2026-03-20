import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { adminStorage } from '@/lib/adminApi';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminLayout() {
  const navigate = useNavigate();
  const { salaId } = useParams<{ salaId: string }>();
  const [session, setSession] = useState(adminStorage.getSession());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!session || !adminStorage.isAuthenticated()) {
      navigate('/admin');
    } else if (salaId && session.salaId.toString() !== salaId) {
      navigate(`/admin/${session.salaId}`);
    }
  }, [session, salaId, navigate]);

  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <AdminSidebar
          salaId={session.salaId.toString()}
          nomeSala={session.nomeSala}
          semestre={session.semestre}
        />
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-[-3.5rem] p-2 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto transition-all duration-300">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant="outline"
            className="h-10 w-10 p-0 lg:hidden rounded-xl"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Painel Administrativo
          </h1>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
