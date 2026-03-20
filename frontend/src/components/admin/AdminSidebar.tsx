import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, LogOut, Shield, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminStorage } from '@/lib/adminApi';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  salaId: string;
  nomeSala: string;
  semestre: string;
  onClose?: () => void;
}

export function AdminSidebar({ salaId, nomeSala, semestre, onClose }: AdminSidebarProps) {
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
    onClose?.();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose?.();
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-screen p-6 flex flex-col relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4 lg:hidden h-8 w-8"
      >
        <X className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-3 mb-8 pt-6 lg:pt-0">
        <div className="w-12 h-12 bg-gradient-to-br from-[#5A7C7A] to-[#6B9B7A] rounded-xl flex items-center justify-center shadow-lg">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
            Painel Admin
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {nomeSala}
          </p>
        </div>
      </div>
      <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 mb-6">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Semestre</p>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{semestre}</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                "hover:bg-slate-100 dark:hover:bg-slate-800",
                isActive
                  ? "bg-gradient-to-r from-[#5A7C7A] to-[#6B9B7A] text-white shadow-lg"
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
