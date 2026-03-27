import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Calendar, User, LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  onClose?: () => void;
  isOpen?: boolean;
}

export function Sidebar({ onClose }: SidebarProps) {
  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Início', path: '/' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Horários', path: '/horarios' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Aulas', path: '/lessons' },
    { icon: <User className="w-5 h-5" />, label: 'Perfil', path: '/#profile' },
  ];

  return (
    <aside className="w-72 bg-ink text-paper h-screen flex flex-col border-r-[3px] border-ink shadow-brutal relative">
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 lg:hidden bg-paper text-ink border-[3px] border-[var(--paper)] shadow-brutal"
        onClick={onClose}
        aria-label="Fechar menu"
      >
        <X className="w-4 h-4" />
      </Button>

      {/* Logo */}
      <div className="p-6 pt-12 lg:pt-8">
        <div className="border-[3px] border-[var(--paper)] bg-paper text-ink rounded-sm shadow-brutal p-4 text-center">
          <p className="text-xs font-mono tracking-[0.1em] uppercase mb-1">Lista de Atividades</p>
          <h1 className="text-2xl font-extrabold leading-none">FATEC</h1>
          <div className="divider-strong mt-3" />
          <p className="text-xs font-mono mt-2">2026 / Acadêmico</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-6 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3 border-[3px] rounded-sm font-mono text-sm uppercase tracking-[0.08em] transition-all ${
                isActive
                  ? 'bg-paper text-ink border-[var(--paper)] shadow-brutal -translate-y-[2px]'
                  : 'bg-ink text-paper border-[color:rgba(247,243,235,0.4)] hover:bg-paper hover:text-ink hover:border-[var(--paper)] hover:-translate-y-[2px]'
              }`
            }
          >
            <span className="text-xs brutal-num">{String(index + 1).padStart(2, '0')}</span>
            {item.icon}
            <span className="flex-1">{item.label}</span>
          </NavLink>
        ))}

        <button className="w-full flex items-center gap-3 px-4 py-3 border-[3px] rounded-sm bg-alert text-paper border-[color:rgba(247,243,235,0.6)] hover:-translate-y-[2px] shadow-brutal transition-all font-mono uppercase tracking-[0.08em]">
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </nav>
    </aside>
  );
}
