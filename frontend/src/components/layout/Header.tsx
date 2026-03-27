import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

export function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  const handleBack = () => navigate(-1);

  const getTitle = () => {
    if (isHome) return 'FATEC / LISTA DE ATIVIDADES';
    const parts = location.pathname.split('/').filter(Boolean);
    return ['FATEC', ...parts].join(' / ').toUpperCase();
  };

  return (
    <header className="w-full bg-ink text-paper border-b-[3px] border-ink shadow-brutal">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 py-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden bg-paper text-ink border-[3px] border-[var(--paper)] hover:-translate-y-[2px] shadow-brutal"
            aria-label={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          {!isHome && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleBack}
              className="hidden sm:inline-flex bg-paper text-ink border-[3px] border-[var(--paper)] shadow-brutal hover:-translate-y-[2px]"
              aria-label="Voltar"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}

          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-mono tracking-[0.08em]">2026 / SISTEMA ACADÊMICO</span>
            <h1 className="text-lg sm:text-xl md:text-2xl leading-tight font-extrabold font-[inherit]">
              {getTitle()}
            </h1>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="px-3 py-1 bg-accent text-ink border-[3px] border-ink shadow-brutal text-xs font-mono uppercase tracking-[0.1em]">
            Notificações: 1
          </div>
        </div>
      </div>
    </header>
  );
}
