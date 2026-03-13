import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Calendar, Mail, ShoppingBag, User, LogOut } from 'lucide-react';

export function Sidebar() {
  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Início', path: '/' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Aulas', path: '/lessons' }, // We'll map internally, but standard paths for now
    { icon: <Calendar className="w-5 h-5" />, label: 'Horário', path: '/#schedule' },
    { icon: <Mail className="w-5 h-5" />, label: 'Mensagens', path: '/#inbox' },
    { icon: <ShoppingBag className="w-5 h-5" />, label: 'Loja', path: '/#shop' },
    { icon: <User className="w-5 h-5" />, label: 'Perfil', path: '/#profile' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0 shrink-0 select-none">
      {/* Logo */}
      <div className="p-6 flex items-center justify-center">
        <h1 className="text-2xl font-black text-indigo-900 tracking-tight leading-none text-center relative z-10 w-full whitespace-nowrap">
          <span className="block -mb-1" style={{ color: '#B20000' }}>Lista de Atividades</span>
          <span className="block" style={{ color: '#B20000' }}>FATEC</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-xl transition-colors font-bold text-sm ${
                isActive && item.path !== '/#schedule' // Simple matching for visual demo
                  ? 'bg-amber-100/50 text-indigo-900 border border-amber-200'
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
