import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Home, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  const handleBack = () => {
    navigate(-1);
  };

  const getTitle = () => {
    if (isHome) return 'Visão Geral';
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length > 0) return 'Aulas';
    return 'Visão Geral';
  };

  return (
    <header className="w-full bg-slate-50 border-b-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="rounded-xl h-10 w-10 flex-shrink-0 lg:hidden"
            aria-label={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          {!isHome && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleBack}
              className="rounded-xl border-slate-200 text-slate-500 hover:text-slate-900 shadow-none h-10 w-10 font-bold hidden sm:flex"
              aria-label="Voltar"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          {!isHome && (
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              {getTitle()}
            </h1>
          )}
        </div>

        <Button 
          variant="outline" 
          className="rounded-xl border-slate-200 text-slate-500 font-bold hover:text-slate-900 hover:border-slate-300 shadow-none gap-2 h-10 px-3 sm:px-4 text-xs cursor-pointer group transition-all duration-300 hidden sm:flex"
        >
          Notificações
          <div className="w-4 h-4 bg-rose-500 text-white text-[9px] rounded-full flex items-center justify-center font-black group-hover:scale-125 group-hover:-translate-y-0.5 transition-transform duration-300 ease-out shadow-sm">
            1
          </div>
        </Button>
      </div>
    </header>
  );
}
