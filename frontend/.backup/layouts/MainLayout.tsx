import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { logout } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import {
  Menu,
  BookOpen,
  ClipboardList,
  Vote,
  Users,
  UserCheck,
  Settings,
  LogOut,
  GraduationCap,
} from 'lucide-react';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { salaNome, aluno, isLider } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const alunoNav: NavItem[] = [
    { label: 'Matérias', to: '/aluno', icon: <BookOpen className="h-4 w-4" /> },
    {
      label: 'Atividades',
      to: '/aluno/atividades',
      icon: <ClipboardList className="h-4 w-4" />,
    },
    { label: 'Votações', to: '/aluno/votacoes', icon: <Vote className="h-4 w-4" /> },
  ];

  const liderNav: NavItem[] = [
    {
      label: 'Gerenciar Sala',
      to: '/lider',
      icon: <Settings className="h-4 w-4" />,
    },
    {
      label: 'Gerenciar Alunos',
      to: '/lider/alunos',
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: 'Aprovar Entradas',
      to: '/lider/entradas',
      icon: <UserCheck className="h-4 w-4" />,
    },
    {
      label: 'Gerenciar Atividades',
      to: '/lider/atividades',
      icon: <ClipboardList className="h-4 w-4" />,
    },
  ];

  const navItems = isLider ? liderNav : alunoNav;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
      isActive
        ? 'bg-blue-500 text-white'
        : 'text-gray-700 hover:bg-gray-200'
    }`;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="h-5 w-5 text-blue-500" />
          <h2 className="font-semibold text-lg">TodoList FATEC</h2>
        </div>
        <p className="text-xs text-muted-foreground">{salaNome}</p>
      </div>
      <Separator />
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/aluno' || item.to === '/lider'}
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
      <Separator />
      <div className="p-4 space-y-3">
        <div className="text-sm">
          <p className="font-medium">{aluno?.nome}</p>
          <p className="text-muted-foreground text-xs">RM: {aluno?.rm}</p>
          <p className="text-muted-foreground text-xs">
            {isLider ? 'Líder' : 'Aluno'}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="flex h-14 items-center px-4 gap-4">
          {/* Mobile menu button */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              }
            />
            <SheetContent side="left" className="p-0 w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-blue-500 lg:hidden" />
            <h1 className="font-semibold text-sm lg:text-base">
              {salaNome}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {aluno?.nome} ({isLider ? 'Líder' : 'Aluno'})
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:top-14 bg-white border-r">
          <SidebarContent />
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-64 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
