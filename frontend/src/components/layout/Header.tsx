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
    const path = location.pathname;

    if (path === '/') return 'ESCOLHA SEU CURSO';
    if (path === '/horarios') return 'HORÁRIOS DE AULA';
    if (/^\/[^/]+\/periodo$/.test(path)) return 'ESCOLHA O TURNO';
    if (/^\/[^/]+\/[^/]+\/semestres$/.test(path)) return 'ESCOLHA O SEMESTRE';
    if (path === '/admin') return 'ENTRAR NA SUA SALA';
    if (/^\/admin\/[^/]+\/atividades$/.test(path)) return 'ATIVIDADES DA SALA';
    if (/^\/admin\/[^/]+\/provas$/.test(path)) return 'PROVAS DA SALA';
    if (/^\/admin\/[^/]+$/.test(path)) return 'VISÃO GERAL DA SALA';
    if (path === '/master-admin/login') return 'ACESSO GERAL';
    if (path === '/master-admin/dashboard') return 'VISÃO GERAL DO SISTEMA';
    if (/^\/[^/]+\/[^/]+\/[^/]+$/.test(path)) return 'AGENDA DO SEMESTRE';

    return 'SEU CALENDÁRIO ACADÊMICO';
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
            <span className="text-xs sm:text-sm font-mono tracking-[0.08em]">2026 / Seu Calendário Acadêmico</span>
            <h1 className="text-lg sm:text-xl md:text-2xl leading-tight font-extrabold font-[inherit]">
              {getTitle()}
            </h1>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="px-3 py-1 bg-accent text-ink border-[3px] border-ink shadow-brutal text-xs font-mono uppercase tracking-[0.1em]">
            Avisos: 1
          </div>
        </div>
      </div>
    </header>
  );
}
