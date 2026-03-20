import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Calendar, Mail, ShoppingBag, User, LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Início', path: '/' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Aulas', path: '/lessons' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Horário', path: '/#schedule' },
    { icon: <Mail className="w-5 h-5" />, label: 'Mensagens', path: '/#inbox' },
    { icon: <ShoppingBag className="w-5 h-5" />, label: 'Loja', path: '/#shop' },
    { icon: <User className="w-5 h-5" />, label: 'Perfil', path: '/#profile' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 lg:hidden h-8 w-8"
        onClick={() => {
          const layoutState = (window as any).__sidebarOpen;
          if (layoutState?.setSidebarOpen) {
            layoutState.setSidebarOpen(false);
          }
        }}
      >
        <X className="w-4 h-4" />
      </Button>

      {/* Logo */}
      <div className="p-6 flex items-center justify-center pt-10 lg:pt-6">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none text-center relative z-10 w-full whitespace-nowrap">
          <span className="block -mb-1">Lista de Atividades</span>
          <span className="block">FATEC</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-colors font-bold text-sm ${
                isActive && item.path !== '/#schedule'
                  ? 'bg-amber-100/50 text-slate-900 border border-amber-200'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}

        <button className="flex items-center gap-4 px-4 py-3 mt-4 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 w-full font-bold text-sm transition-colors text-left">
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </nav>
    </aside>
  );
}
