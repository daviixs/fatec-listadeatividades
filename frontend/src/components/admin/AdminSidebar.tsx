import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, LogOut, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminStorage } from '@/lib/adminApi';
import { toast } from 'sonner';

interface AdminSidebarProps {
  salaId: string;
  nomeSala: string;
  semestre: string;
}

export function AdminSidebar({ salaId, nomeSala, semestre }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: `/admin/${salaId}`,
    },
    {
      label: 'Atividades',
      icon: FileText,
      path: `/admin/${salaId}/atividades`,
    },
    {
      label: 'Provas',
      icon: Calendar,
      path: `/admin/${salaId}/provas`,
    },
  ];

  const handleLogout = () => {
    adminStorage.clearSession();
    toast.success('Você saiu do painel admin');
    navigate('/admin');
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-primary-700 text-lg leading-tight">
              Painel Admin
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {nomeSala}
            </p>
          </div>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Semestre</p>
          <p className="text-sm font-bold text-primary-700">{semestre}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                "hover:bg-slate-100 dark:hover:bg-slate-800",
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-700 dark:text-slate-300"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-semibold"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
