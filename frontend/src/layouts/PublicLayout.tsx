import { Outlet, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogIn } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <GraduationCap className="h-6 w-6 text-blue-500" />
            <h1 className="font-semibold text-lg text-gray-800">LISTA de TAREFAS FATEC</h1>
          </Link>

          <Link to="/login">
            <Button variant="default" size="sm" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Entrar
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="bg-white border-t py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} LISTA de TAREFAS FATEC. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
